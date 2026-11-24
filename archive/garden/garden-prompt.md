# 任务：把首页的枯山水改成江南私家园林

本项目是一个个人作品集网站，首页是一座可交互的 3D 园林，每个景点对应一个栏目，点击后页面从右侧滑入（sheet）。现在的园林是日式枯山水：耙沙、置石、石灯笼、蹲踞。请把它改成**江南私家园林**（参考拙政园、留园、网师园），**站点结构、路由、相机取景机制和 UI 系统全部保留**。

目标是让人一看就觉得“像园林”，而不是“摆了几个中式模型”。园林的本质是安排好的观看顺序，所以布局、遮挡和取景比单个模型的精度重要。

注意：枯山水不是中式园林。耙沙、白砂纹、蹲踞、石灯笼（tōrō）都必须移除，不要混用。

---

## 0. 现状（先读这些文件再动手）

| 文件 | 现在负责什么 | 这次要怎么改 |
|---|---|---|
| `src/garden/layout.ts` | `OBJECTS`（景点列表，带 `route`/`label`/`kind`/`x`/`z`/`r`/`labelY`）、`VIEWS`、`frameFor()`、按时辰分的 `LIGHT` | 换新的 `kind` 和坐标，调 `LIGHT` 配色 |
| `src/garden/objects.tsx` | `rockGeometry()`、`Stone`、`Lantern`、`Basin` | 换成园林建筑和山石组件，`rockGeometry` 留着改成太湖石 |
| `src/garden/sand.ts` | 用 canvas 高度图当 bump map 来耙沙 | 改成 `water.ts`，用来做水面涟漪 |
| `src/garden/Garden.tsx` | Canvas、灯光插值、相机取景、DOM 标签、耙沙的指针事件 | 地面换成“陆地 + 水池”，交互从耙沙改成拨水 |
| `src/components/Chrome.tsx` | 首页提示、终端命令 `rake`、欢迎语 | 改文案和命令 |
| `src/components/bits.tsx`、`src/pages/{Journal,NotFound,Works}.tsx`、`README.md` | 文案里写着 raked / lantern / stone | 改文案 |
| `src/styles.css` | `--sand`（页面底色，跟着时辰变） | 改成园林底色（雾色） |

**必须保留的机制：**

- `OBJECTS` 的数据形状，以及“带 `route` 的物体就能点击、会有 DOM 标签”这条规则。`r` 是取景半径（`frameFor` 用 `r * 3.5` 当 `halfW`），`labelY` 是标签高度。建筑的 `r` 按占地半径填，`labelY` 按屋脊高度填。
- `frameFor()` / `VIEWS` 的取景逻辑：sheet 打开后，相机会把内容挪到屏幕剩下的区域里。
- 四个时辰 `dawn/noon/dusk/night` 的插值灯光，`lamp` 点光源在黄昏和夜里亮起，并带闪烁。
- `reducedMotion()`：开启时直接跳到目标状态，不做动画。
- 窄屏打开 sheet 时 `frameloop='never'`。
- 雾的远近跟相机距离挂钩（`near = d*1.05`，`far = d*2.2`）。不要照搬通用指南里的 `FogExp2(0.015)`，那个参数是给 1.6m 眼高的漫游场景用的，这里的相机离地有 30–60 单位。
- 低多边形、`flatShading` 的整体画风，以及 `<Canvas flat>`（不做色调映射）。淡雅感靠低饱和配色来做，不要靠换 ACES。
- **不加新依赖。** 需要的东西 three 和已经装好的 `@react-three/drei` 都有。不引入 postprocessing、CSG、Marching Cubes。

**坐标系：** 地面是 `PLANE_W × PLANE_H = 64 × 42`，x 取 −32…32，z 取 −21…21。相机在 +z 一侧俯看 −z 方向（首页大约 45°），所以 **−z 是远处（画面上方），+z 是近处（画面下方）**。sheet 从右边盖住最多 60% 的宽度。

---

## 1. 造园原则：在这个项目里怎么落实

这个项目是**俯瞰 + 点击景点**，不是第一人称漫游。所以“移步换景”体现在景点之间的取景切换上，不需要做游线漫游。

| 原则 | 在本项目里的落实 |
|---|---|
| 以水为心 | 先画水池轮廓，放在场地中间略偏左，大约占园区内容范围的 1/3。所有景点都环水布置 |
| 移步换景 | 每个景点的 `frameFor` 取景都要是一幅完整的小画面，有主景、前景遮挡、背景。可以按 `kind` 单独调 `off` 偏移（比如月洞门要压低视角去穿过门洞） |
| 欲扬先抑 | 首次加载时，相机从入口小院的月洞门后面、低处起步（近、窄、暗），然后拉升到首页俯瞰，看到整片水面。只在第一次进站时做；`reducedMotion` 时跳过 |
| 曲径通幽 | 廊、桥、园路都用 `CatmullRomCurve3` 或者折线来做，不走长直线，不拐直角 |
| 障景 | 俯瞰时，假山、云墙、树丛要遮住一部分水面和建筑，不能像沙盘一样一览无余。**但是所有带 route 的景点在 home/works 视图里都必须看得见、点得到**，标签不能被挡住 |
| 框景 / 漏景 | 至少 3 处：①月洞门对着置石 + 竹（about）；②复廊或云墙上的漏窗；③水榭柱子之间看对岸。每个框里都要专门布置一个小景 |
| 对景 | 至少 1 组隔水相望：假山亭 ↔ 水榭（东西向），厅堂 ↔ 月洞门小院（南北向） |
| 借景 | 场地外面、−z 方向远处放低多边形的塔和远山剪影，让雾把它们吃掉一半（雾因子大约 0.6–0.8，实际调） |
| 虚实相生 | 白墙（实）上开漏窗（虚）；廊一边是墙一边空着；山是实的，水是虚的 |
| 疏密有致 | 建筑和植物都成团布置，不均匀撒点。留出大片水面和白墙当“留白” |
| 不对称 | 不要贯穿全园的中轴线。只有单体建筑可以对称 |

---

## 2. 景点映射（route 不变，换成园林里的“物”）

| route / label | 原来 | 改成 | 建议位置 (x, z) | 说明 |
|---|---|---|---|---|
| `/research` `research/` | 大石 | **厅堂**（远香堂式四面厅） | (−4, −9) | 园中主建筑，坐北朝南，隔着水面对着相机，倒影是首页的主画面 |
| `/art` `art/` | 大石 | **假山 + 山顶六角亭** | (−14, −2) | 太湖石叠山，有蹬道，兼作西侧障景；登高点 |
| `/music` `music/` | 小石 | **水榭**（半架在水上） | (10, −4) | 平台贴水，与假山亭隔水对景 |
| `/design` `design/` | 石 | **旱舫 / 石舫** | (7, 4) | 船头伸进水里 |
| `/experiments` `experiments/` | 石 | **曲桥**（低平、贴水、折线） | (−5, 2) | 横跨水池西窄处，桥头配一块置石 |
| `/journal` `journal` | 石灯笼 | **两层楼阁**，檐下挂灯笼 | (15, −10) | 园中最高点，放在后方不挡视线；**沿用 `lamp` 点光源和 `glow` 材质**，入夜灯笼亮 |
| `/about` `about` | 蹲踞 | **月洞门小院**：粉墙 + 月洞门 + 置石 + 竹 + 芭蕉 | (3, 8) | 框景；focus 时相机压低，穿过门洞往北看，隔水看到厅堂 |
| 无 route | 小石 | 驳岸石、零星置石 | 沿水岸 | 不可点击 |
| 新增（无 route） | — | 曲廊 / 复廊、云墙、垂柳、竹丛、松、梅或枫、荷叶 | 见下 | 纯景观 |

上面的坐标只是起点。放完以后，从 home、works 和每个 focus 视图分别截图检查：主景是不是清楚、有没有遮挡关系、标签有没有被挡住。

`OBJECTS` 里的 `kind` 建议改成 `'hall' | 'rockery' | 'waterside' | 'boat' | 'bridge' | 'tower' | 'moongate' | 'rock'`。纯景观元素（廊、墙、树、荷叶）单独放进一个 `SCENERY` 列表，不要塞进 `OBJECTS`，免得被算进 `minX/maxX` 的取景边界里，也免得在耙沙/涟漪逻辑里被当成障碍物。

---

## 3. 元素与建模（程序化、低多边形）

**建筑：体量要小、轻、通透**

- **屋顶起翘**是中式的灵魂。屋面要做成曲面：顶点按到四角的距离，往上抬一个二次曲线位移（江南“嫩戗发戗”，翘得高而轻）。不要用平板斜面，也不要用 `coneGeometry(…, 4)`。写一个 `roofGeometry(w, d, h, upturn)`，亭、榭、厅、楼、廊都复用它。
- 柱子、栏杆、瓦垄、廊的柱子用 `InstancedMesh`。曲廊沿着样条按段实例化：柱子 + 坐槛 + 一段屋顶。
- **漏窗**：`ShapeGeometry` 加 `holes`，做冰裂纹或几何格。**月洞门**：墙体 `Shape` 里挖一个圆洞，再 `ExtrudeGeometry`。
- **云墙**：墙顶轮廓用正弦曲线，上面盖一道黛瓦压顶。
- 舫：船形台基 + 前亭 + 中舱 + 后楼（两层），简化处理就行。

**山石**

- 太湖石直接复用 `rockGeometry`：竖向拉伸（`squash > 1`），提高细分，加一层高频噪声做“皱”。“透”的孔洞先不做，用凹陷和阴影来暗示（`// ponytail:` 注释写明：需要真孔洞时再上 SDF 或 CSG）。
- 黄石假山：用棱角分明的盒子堆叠，上面放亭子。
- 置石：单独一块立在白墙前面，配竹或芭蕉。

**植物（讲究姿态，不讲数量）**

- 垂柳：水边，往水面探身，枝条用细条带往下垂。
- 竹：细圆柱 + 叶片卡片，用 `InstancedMesh`。
- 松：在假山上，歪斜虬曲。梅或枫：一两株当色彩点缀。
- 荷叶：`InstancedMesh` 的扁圆盘，随机旋转、高度略有起伏，成片分布，不要铺满整个池子。

**铺地**：陆地用一张平面加卵石或青砖纹理（canvas 程序化生成就够），沿岸一圈驳岸石。

---

## 4. 配色与材质（江南：粉墙黛瓦 + 栗色木构）

| 部位 | 颜色 | 材质 |
|---|---|---|
| 粉墙 | `#EDEAE2` – `#F2EFE8` | roughness 0.9 |
| 黛瓦 / 屋顶 | `#3A3D42` – `#4A4E55` | roughness 0.7 |
| 木构（柱、栏、窗） | `#5A3A28` – `#7A4E33` 栗壳色 | roughness 0.6，**不要大红** |
| 石材 / 太湖石 | `#8F8C85` / `#B5B2A8` | roughness 0.95，`flatShading` |
| 水 | `#2F4A44` 深绿偏墨 | 重点在倒影，不要清澈见底 |
| 陆地 / 苔 | 低饱和灰绿、灰褐 | 植物整体饱和度降 10–20% |

禁止：大面积朱红配金色（那是皇家园林或寺庙的感觉）、高饱和色、金属反光。

**`LIGHT` 调色方向（烟雨江南：低对比、偏青灰）：**

- `noon`：底色和雾色在 `#dfe3e0` 附近，天光偏冷，地光偏暖，主光柔和。
- `dawn`：雾色偏灰粉，光低而侧。
- `dusk`：暖光，但要压低饱和度，不要变成橙色。灯笼开始亮。
- `night`：墨蓝底 `#141a1f` 左右，主光是冷月光，楼阁灯笼和少量檐下灯笼是暖色点光源。**月亮要倒映在水里。**

`styles.css` 里的 `--sand` 改名为 `--mist`，值跟各时辰的 `bg` 对齐。

---

## 5. 水面与交互（替换耙沙）

- 水池：用 `ShapeGeometry`，形状是闭合的 `CatmullRomCurve3` 样条，岸线曲折，有湾有岬。陆地平面在同一个 `Shape` 里挖洞，水面比陆地低大约 0.25。
- 倒影用 drei 的 `MeshReflectorMaterial`（已经安装了，不要用 `Water.js`）。设置要克制：`mirror` 0.5 左右，带一点 blur，`resolution` 512（窄屏 256），`color #2F4A44`。水面要“静”，扰动强度小。
- 首页最重要的画面是厅堂、水榭、垂柳的倒影，所以要先确认这三样在 home 视角下能在水里成像。
- **交互：拖动水面会泛起涟漪。** 把 `sand.ts` 改成 `water.ts`，保留 canvas 高度图的思路：指针在水面拖动时写入涟漪环，每帧衰减，结果当作 `MeshReflectorMaterial` 的 `distortionMap` 或水面的 `normalMap`。canvas 分辨率 512 就够了。
- `store.rake` / `rakeNonce` 改名为 `still` / `stillNonce`，作用是让水面立刻平静下来。
- 指针事件只挂在水面 mesh 上。点到陆地什么都不发生，不要让陆地拦截景点的点击。

---

## 6. 文案（英文站点，保持语气）

- 首页提示：`drag` → `stir the water`；`click` → `a pavilion opens a section`。
- 终端：`rake` 命令改成 `still`，帮助文本写 `still           calm the water`，回显 `the water is still again.`。`time night` 的回显改成 `the moon is on the water. the lanterns are lit.`。欢迎语里的 `click a stone` 改成 `click a pavilion`。
- `bits.tsx`：`Last raked …` 改成 `Last swept …`。
- `NotFound.tsx`：`This path isn't raked yet.` 改成 `This path winds nowhere yet.`。
- `Journal.tsx`：`The lantern in the garden is lit …` 改成 `The lanterns in the pavilion are lit …`。
- `Works.tsx`：`Each section is also a stone in the garden.` 改成 `Each section is also a place in the garden.`。
- `README.md`：把 rakeable Zen garden、stone、lantern、basin 都换掉，写上第 2 节的新映射。
- `lost` 视图（404）：取景改成对着一段无路可走的云墙或者假山背面。

---

## 7. 性能

- 静态几何（墙、铺地、驳岸）用 `BufferGeometryUtils.mergeGeometries` 合并；材质集中定义一次，到处复用。
- 重复元素一律 `InstancedMesh`：瓦垄、柱子、栏杆、竹、荷叶、卵石。
- 只有主光投影；`shadow.camera` 保持现在的 ±26/±20。
- 倒影是额外的一遍渲染：窄屏把分辨率降到 256；sheet 打开且 `frameloop='never'` 时自然就停了。
- `MeshReflectorMaterial` 一旦被引入，drei 会进主包（现在只有 `ModelViewer` 懒加载它）。构建后看一下包体积，涨太多就改成 `three/examples/jsm/objects/Reflector`。

---

## 8. 交付检查清单

- [ ] 水面在中心，建筑环水布置；布局不对称，没有中轴线
- [ ] 7 个 route 都还能点开，标签在 home 和 works 视图里都可见，没有被遮挡
- [ ] sheet 打开时，取景仍然把景点放在剩余的屏幕区域里；窄屏不渲染
- [ ] 首次进站有“抑”到“扬”（月洞门后面 → 俯瞰水面），`reducedMotion` 时跳过
- [ ] 至少 3 处框景、至少 1 组隔水对景
- [ ] 俯瞰时有障景，不是一览无余；远处有借景剪影 + 雾
- [ ] 屋顶有曲面起翘，不是平板锥体
- [ ] 配色低饱和，木构是栗色，没有大红配金
- [ ] 水里能清楚映出厅堂、水榭、垂柳；夜里能看到月亮的倒影
- [ ] 拖动水面有涟漪，`still` 命令能让水面平静
- [ ] 枯山水元素全部移除：没有沙纹、石灯笼、蹲踞，文案里也没有 rake、gravel、stone
- [ ] 重复元素都已实例化；`npm run build` 通过；中端笔记本上帧率稳定在 60
