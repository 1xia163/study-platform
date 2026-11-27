// 数据结构题库（107 道）
export const dataStructureQuestions = [

  // ===== 年份：2024 =====
  {
    "id": 2,
    "year": 2024,
    "course": "数据结构",
    "type": "判断",
    "knowledgePoint": "哈夫曼树",
    "score": 1,
    "title": "哈夫曼树的带权路径长度WPL一定是所有二叉树中最小的",
    "options": [
      "正确",
      "错误"
    ],
    "answer": "正确",
    "explanation": "哈夫曼树就是最优二叉树，WPL最小。"
  },

  // ===== 年份：2023 =====
  {
    "id": 4,
    "year": 2023,
    "course": "数据结构",
    "type": "单选",
    "knowledgePoint": "KMP",
    "score": 2,
    "title": "KMP算法主要优化了暴力匹配的哪一个问题？",
    "options": [
      "回溯主串指针",
      "回溯模式串指针",
      "减少存储空间",
      "支持多模式匹配"
    ],
    "answer": "A",
    "explanation": "KMP避免主串指针回退，提升匹配效率。"
  },

  // ===== 年份：2013 =====
  {
    "id": 20001,
    "course": "数据结构",
    "year": 2013,
    "years": [
      2013
    ],
    "type": "单选",
    "knowledgePoint": "数据结构综合",
    "score": 2,
    "title": "线性表的表元素的存储方式有顺序和链接两种。下表给出含 6 个元素的集合的存\n储结构，试指出它使用的存储方式是________。",
    "options": [
      "单链表",
      "双向链表",
      "循环链表",
      "双向循环链表"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2012-2013A卷",
    "sourceQuestion": "一、1",
    "images": [
      "/question-images/ds-2013-a-choice-01.png"
    ]
  },
  {
    "id": 20002,
    "course": "数据结构",
    "year": 2013,
    "years": [
      2013
    ],
    "type": "单选",
    "knowledgePoint": "线性表",
    "score": 2,
    "title": "在一个长度为 n（n>1）的单链表上，设有头和尾两个指针，执行________操作与\n  链表的长度 n 有关。",
    "options": [
      "删除单链表中第一个元素",
      "删除单链表中最后一个元素",
      "在单链表第一个元素前插入一个新元素",
      "在单链表最后一个元素后插入一个新元素"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2012-2013A卷",
    "sourceQuestion": "一、2"
  },
  {
    "id": 20003,
    "course": "数据结构",
    "year": 2013,
    "years": [
      2013
    ],
    "type": "单选",
    "knowledgePoint": "栈与队列",
    "score": 2,
    "title": "设栈 S 和队列 Q 的初始状态均为空，元素 a, b, c, d, e, f 依次进入栈 S。若每个元\n  素出栈后立即进入队列 Q，且 6 个元素出队的顺序是 b, d, c, f, e, a，则栈 S 的容\n  量至少是________。",
    "options": [
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2012-2013A卷",
    "sourceQuestion": "一、3"
  },
  {
    "id": 20004,
    "course": "数据结构",
    "year": 2013,
    "years": [
      2013
    ],
    "type": "单选",
    "knowledgePoint": "树与二叉树",
    "score": 2,
    "title": "一棵非空的二叉树的先序遍历序列与后序遍历序列正好相反，则该二叉树一定满\n  足________。",
    "options": [
      "所有的结点均无左孩子",
      "所有的结点均无右孩子",
      "只有一个叶子结点",
      "是任意一棵二叉树"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2012-2013A卷",
    "sourceQuestion": "一、4"
  },
  {
    "id": 20005,
    "course": "数据结构",
    "year": 2013,
    "years": [
      2013
    ],
    "type": "单选",
    "knowledgePoint": "树与二叉树",
    "score": 2,
    "title": "下列线索二叉树中（用虚线表示线索）\n                  ，符合后序线索树定义的是________。",
    "options": [
      "见图 A",
      "见图 B",
      "见图 C",
      "见图 D"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2012-2013A卷",
    "sourceQuestion": "一、5",
    "images": [
      "/question-images/ds-2013-a-choice-05.png"
    ]
  },
  {
    "id": 20006,
    "course": "数据结构",
    "year": 2013,
    "years": [
      2013
    ],
    "type": "单选",
    "knowledgePoint": "树与二叉树",
    "score": 2,
    "title": "已知一棵完全二叉树的第 6 层（设根为第 1 层）有 8 个叶结点，则该完全二叉树\n  的结点个数最多是________。",
    "options": [
      "39",
      "52",
      "111",
      "119"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2012-2013A卷",
    "sourceQuestion": "一、6"
  },
  {
    "id": 20007,
    "course": "数据结构",
    "year": 2013,
    "years": [
      2013
    ],
    "type": "单选",
    "knowledgePoint": "图",
    "score": 2,
    "title": "在有向图的邻接矩阵存储结构中，某一行中非零元素的个数等于________。",
    "options": [
      "对应顶点 v 的度",
      "对应顶点 v 的出度",
      "对应顶点 v 的入度",
      "依附于对应顶点 v 的边数"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2012-2013A卷",
    "sourceQuestion": "一、7"
  },
  {
    "id": 20008,
    "course": "数据结构",
    "year": 2013,
    "years": [
      2013
    ],
    "type": "单选",
    "knowledgePoint": "数据结构综合",
    "score": 2,
    "title": "用有向无环图描述表达式(C+D)*（（C+D）/D），至少需要顶点的数目为\n  ________。",
    "options": [
      "5",
      "6",
      "8",
      "9"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2012-2013A卷",
    "sourceQuestion": "一、8"
  },
  {
    "id": 20009,
    "course": "数据结构",
    "year": 2013,
    "years": [
      2013
    ],
    "type": "单选",
    "knowledgePoint": "排序",
    "score": 2,
    "title": "下列排序算法中，________算法可能会出现下面情况：在最后一趟排序开始之前，\n  所有元素都不在其最终的位置上。",
    "options": [
      "插入排序",
      "起泡排序",
      "快速排序",
      "堆排序"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2012-2013A卷",
    "sourceQuestion": "一、9"
  },
  {
    "id": 20010,
    "course": "数据结构",
    "year": 2013,
    "years": [
      2013
    ],
    "type": "单选",
    "knowledgePoint": "堆",
    "score": 2,
    "title": "已知关键字序列 84, 68, 23, 55, 14, 2, 19, 27, 1, 11 是最大堆，插入关键字 73，调\n  整后得到的最大堆是_________。",
    "options": [
      "84, 68, 73, 55, 14, 23, 19, 27, 1, 11, 2",
      "84, 73, 55, 68, 27, 23, 19, 14, 11, 2,1",
      "84, 73, 68, 55, 27, 23, 19, 14, 11, 2,1",
      "84, 73, 23, 55, 68, 2, 19, 27, 1, 11, 14"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2012-2013A卷",
    "sourceQuestion": "一、10"
  },
  {
    "id": 20011,
    "course": "数据结构",
    "year": 2013,
    "years": [
      2013
    ],
    "type": "单选",
    "knowledgePoint": "树与二叉树",
    "score": 2,
    "title": "高度为 4 的 AVL 树的节点数最少为________。",
    "options": [
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2012-2013A卷",
    "sourceQuestion": "一、11"
  },
  {
    "id": 20012,
    "course": "数据结构",
    "year": 2013,
    "years": [
      2013
    ],
    "type": "单选",
    "knowledgePoint": "数据结构综合",
    "score": 2,
    "title": "下列叙述中，不符合 m 阶 B 树定义要求的是________。",
    "options": [
      "根结点最多有 m 棵子树",
      "所有叶结点都在同一层上",
      "各结点内关键字均升序或降序排列",
      "叶结点之间通过指针链接"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2012-2013A卷",
    "sourceQuestion": "一、12"
  },
  {
    "id": 20013,
    "course": "数据结构",
    "year": 2013,
    "years": [
      2013
    ],
    "type": "主观",
    "knowledgePoint": "树与二叉树",
    "score": 10,
    "title": "对下面的二叉树 T，回答下列问题：1）给出先序、中序和后序遍历 T 的结果。2）将 T 转换为一般树。",
    "options": [],
    "answer": "先序：A、B、D、G、H、J、K、E；中序：G、D、J、H、K、B、E、A；后序：G、J、K、H、D、E、B、A。第2问原答案为图形，尚未转录。",
    "explanation": "无",
    "source": "2012-2013A卷",
    "sourceQuestion": "2",
    "images": [
      "/question-images/ds-2013-a-subjective-02.png"
    ]
  },
  {
    "id": 20014,
    "course": "数据结构",
    "year": 2013,
    "years": [
      2013
    ],
    "type": "主观",
    "knowledgePoint": "排序",
    "score": 8,
    "title": "给出下面有向图所有可能的拓扑排序序列。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2012-2013A卷",
    "sourceQuestion": "3",
    "images": [
      "/question-images/ds-2013-a-subjective-03.png"
    ]
  },
  {
    "id": 20015,
    "course": "数据结构",
    "year": 2013,
    "years": [
      2013
    ],
    "type": "主观",
    "knowledgePoint": "排序",
    "score": 10,
    "title": "有以下关键字：19，14，23，01，68，20，84，27，55，11，10，79，12，使用希尔排序方法将所给关键字排成升序序列，间隔序列为7、3、1，写出每趟排序的结果。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2012-2013A卷",
    "sourceQuestion": "4"
  },
  {
    "id": 20016,
    "course": "数据结构",
    "year": 2013,
    "years": [
      2013
    ],
    "type": "主观",
    "knowledgePoint": "查找",
    "score": 18,
    "title": "设有依以下次序出现的关键字：53、15、72、52、49、68、65、23、31、26、7、91，要求用哈希方法将它们填入有13个位置的哈希表中。1）构造哈希函数，使得发生冲突尽可能地少；2）用线性探测再散列法解决冲突。写出哈希函数并画出最后得到的哈希表，并计算查找成功时的平均查找长度。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2012-2013A卷",
    "sourceQuestion": "5"
  },
  {
    "id": 20017,
    "course": "数据结构",
    "year": 2013,
    "years": [
      2013
    ],
    "type": "主观",
    "knowledgePoint": "图",
    "score": 15,
    "title": "对于图中的 AOE 网：求每个事件和活动的最早开始时间和最迟开始时间；完成工程至少需要多少时间？求所有关键活动及关键路径。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2012-2013A卷",
    "sourceQuestion": "6",
    "images": [
      "/question-images/ds-2013-a-subjective-06.png"
    ]
  },
  {
    "id": 20018,
    "course": "数据结构",
    "year": 2013,
    "years": [
      2013
    ],
    "type": "主观",
    "knowledgePoint": "树与二叉树",
    "score": 15,
    "title": "设二叉树 T 以二叉链表结构存储，每个结点含 lchild、rchild 和 data 三个域。利用叶结点中空的右链指针域 rchild，将所有叶结点自左至右链接成单链表。设计算法返回最左叶结点地址（链头），使用 C 或 C++ 实现。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2012-2013A卷",
    "sourceQuestion": "7"
  },

  // ===== 年份：2014 =====
  {
    "id": 20019,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "数据结构综合",
    "score": 2,
    "title": "设有求 Fibonacci 数列第 n 项值的问题 P。代码：public static int fib(int n) { if (n == 1 || n == 2) return 1; else return fib(n - 1) + fib(n - 2); }\n设 n 是描述问题规模的正整数，上面程序片段的时间复杂度是______。",
    "options": [
      "O(n)",
      "O(n log2n)",
      "O(n2)",
      "O(2n)"
    ],
    "answer": "A",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "一、1"
  },
  {
    "id": 20020,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "数据结构综合",
    "score": 2,
    "title": "设有求 Fibonacci 数列第 n 项值的问题 P。代码：public static int fib(int n) { if (n == 1 || n == 2) return 1; else return fib(n - 1) + fib(n - 2); }\n问题 P 的时间复杂度是________。",
    "options": [
      "O(n)",
      "O(n log2n)",
      "O(n2)",
      "O(2n)"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "一、2"
  },
  {
    "id": 20021,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "栈与队列",
    "score": 2,
    "title": "下列代码段的输出是________。\n    Stack<String> s = new Stack<String>();            //初始化 String 类型的栈 s\n\n    String str = \"cat\";                               //说明变量 str 并赋初值\n\n    for (int i = 0; i < str.length(); i++)            //str.length()表示 str 的长度\n         s.push(str.substring(i));                    // substring(i)：截取位置 i 后所有字母\n\n                                                      //（包括该位置）\n\n    while (!s.isEmpty())     cout<<s.pop();",
    "options": [
      "catatt",
      "ttatac",
      "tatcat",
      "cattat"
    ],
    "answer": "B",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "一、3"
  },
  {
    "id": 20022,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "栈与队列",
    "score": 2,
    "title": "若队列 q 中从队头到队尾的整数值依次是 1,2,3,4,5,6，s 是栈。q 与 s 上的操\n  作只有以下 3 种：(I) 从 q 中删除 x 并输出 x；(II) 从 q 中删除 x 并将 x 压入 s\n  中；(III) 从 s 中弹出 x 并输出 x。下列选项中，仅使用前述三种操作（任意合理\n  的次序）不能得到的输出是________。",
    "options": [
      "654321",
      "234561",
      "125643",
      "345612"
    ],
    "answer": "D",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "一、4"
  },
  {
    "id": 20023,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "树与二叉树",
    "score": 2,
    "title": "一棵完全二叉树 T 的全部 k 个叶结点都在同一层中，每个分支结点都有两个子结\n\n                                                 \n\n  点。T 中包含的结点数是________。",
    "options": [
      "k",
      "2k-1",
      "k2",
      "2k-1"
    ],
    "answer": "B",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "一、5"
  },
  {
    "id": 20024,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "数据结构综合",
    "score": 2,
    "title": "将下列数据按序插入到二叉查找树中。得到的树最平衡的是_______。",
    "options": [
      "2 4 7 5 8 10",
      "5 1 2 6 3 4",
      "6 4 1 8 10 5",
      "9 7 2 1 4 0"
    ],
    "answer": "C",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "一、6"
  },
  {
    "id": 20025,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "数据结构综合",
    "score": 2,
    "title": "表达式 P+(Q-R)*A/B 的前缀形式是_______。",
    "options": [
      "+P*-QR/AB",
      "PQR-AB/*+",
      "+P/*-QRAB",
      "+*P-QR/AB"
    ],
    "answer": "C",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "一、7"
  },
  {
    "id": 20026,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "树与二叉树",
    "score": 2,
    "title": "将一棵树（森林）转换为对应的二叉树结构来存储，在二叉树中结点 u 是结点 v\n  的祖父结点，则在原来的树中，u 和 v 可能是哪种关系______。",
    "options": [
      "父子关系",
      "祖孙关系",
      "兄弟关系",
      "以上都有可能"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "一、8"
  },
  {
    "id": 20027,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "数据结构综合",
    "score": 2,
    "title": "数组 unsortedArr 包含一组无序整数，数组 sortedArr 包含一组有序整数。下列 3 个操\n  作均采用最高效的算法，在 sortedArr 上执行时比在 unsortedArr 上执行时效率更高的\n  是________。\n     I．插入新元素\n     II．查找给定的元素\n     III．计算元素的平均值",
    "options": [
      "仅 I",
      "仅 II",
      "仅 III",
      "仅 I 和 II"
    ],
    "answer": "B",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "一、9"
  },
  {
    "id": 20028,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "排序",
    "score": 2,
    "title": "设使用某种排序方法对数据序列进行排序，两趟排序后得到结果是（8，9，10，\n  4，5，6，20，1，2）\n              ，则该排序方法可能是___________。",
    "options": [
      "选择排序",
      "起泡排序",
      "插入排序",
      "堆排序"
    ],
    "answer": "A",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "一、10"
  },
  {
    "id": 20029,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "排序",
    "score": 2,
    "title": "采用递归方式对顺序表进行快速排序，下列关于递归次数的叙述中，正确的是\n  ________。",
    "options": [
      "递归次数与初始数据的排列次序无关",
      "每次划分后，先处理较长的分区可以减少递归次数",
      "每次划分后，先处理较短的分区可以减少递归次数",
      "递归次数与每次划分后得到的分区处理顺序无关"
    ],
    "answer": "D",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "一、11"
  },
  {
    "id": 20030,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "堆",
    "score": 2,
    "title": "以下序列不是堆的是_______。",
    "options": [
      "(100,85,98,77,80,60,82,40,20,10,66)",
      "(100,98,85,82,80,77,66,60,40,20,10)",
      "(10,20,40,60,66,77,80,82,85,98,100)",
      "(100,85,40,77,80,60,66,98,82,10,20)"
    ],
    "answer": "D",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "一、12"
  },
  {
    "id": 20031,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "图",
    "score": 2,
    "title": "下列关于图的叙述中，正确的是_______。\n\n                             \n\n      I．回路是简单路径\n      II．存储稀疏图，用邻接矩阵比邻接表更省空间\n      III．若有向图中存在拓扑序列，则该图不存在回路",
    "options": [
      "仅 II",
      "仅 I、II",
      "仅 III",
      "仅 I、III"
    ],
    "answer": "C",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "一、13"
  },
  {
    "id": 20032,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "数据结构综合",
    "score": 2,
    "title": "一个无向图的广度优先搜索序列________。",
    "options": [
      "只有一种",
      "可能不存在",
      "可能有多种",
      "一定有多种"
    ],
    "answer": "C",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "一、14"
  },
  {
    "id": 20033,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "主观",
    "knowledgePoint": "图",
    "score": 10,
    "title": "利用 Prim 算法求下图的一棵最小（代价）生成树，设顶点1为起始点，写出求解过程。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "2",
    "images": [
      "/question-images/ds-2014-a-subjective-02.png"
    ]
  },
  {
    "id": 20034,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "主观",
    "knowledgePoint": "数据结构综合",
    "score": 5,
    "title": "设树 T 的度为4，其中度为1、2、3和4的结点个数分别为4、2、1、1，计算 T 中的叶子结点个数。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "3"
  },
  {
    "id": 20035,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "主观",
    "knowledgePoint": "查找",
    "score": 15,
    "title": "已知哈希表 A 的地址空间为0~8，哈希函数 H(k)=k mod 7，采用线性探测再散列法解决冲突。依次填入100，20，21，35，3，78，99，45，给出每个关键字的比较次数 m，并求等概率下成功和不成功查找的平均查找长度。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "4"
  },
  {
    "id": 20036,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "主观",
    "knowledgePoint": "图",
    "score": 15,
    "title": "对下面的有向图：a) 给出每个顶点的入度和出度；b) 画出邻接链表；c) 给出5种不同的拓扑序列；d) 给出从1开始的深度优先和广度优先遍历序列。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "5",
    "images": [
      "/question-images/ds-2014-a-subjective-05.png"
    ]
  },
  {
    "id": 20037,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "主观",
    "knowledgePoint": "树与二叉树",
    "score": 12,
    "title": "已知数据序列18、15、41、10、45、30、25、3、71、60、50、12，将各元素依次插入 AVL 树，画出结果。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "6"
  },
  {
    "id": 20038,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "主观",
    "knowledgePoint": "树与二叉树",
    "score": 15,
    "title": "设二叉树 T 以二叉链表结构存储，每个结点含 lchild、rchild 和 data 三个域。用 C 或 C++ 实现算法，将二叉树各分支结点的左、右子树调换位置。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2013-2014A卷",
    "sourceQuestion": "7",
    "images": [
      "/question-images/ds-2014-a-subjective-07.png"
    ]
  },
  {
    "id": 20039,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "数据结构综合",
    "score": 2,
    "title": "下列关于线性表的叙述中，正确的是________。",
    "options": [
      "每个元素最多有一个直接前驱和一个直接后驱",
      "每个元素最少有一个直接前驱和一个直接后驱",
      "每个元素有且只有一个直接前驱，有且仅有一个直接后驱",
      "线性表中的每个元素数据类型必须相同，并且可以分解为更小的数据单元"
    ],
    "answer": "A",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "一、1"
  },
  {
    "id": 20040,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "线性表",
    "score": 2,
    "title": "单链表又称为线性链表，在单链表上实施插入和删除操作_______。",
    "options": [
      "不需移动节点，不需改变节点指针",
      "不需移动节点，只需改变节点指针",
      "只需移动节点，不需改变节点指针",
      "既需移动节点，又需改变节点指针"
    ],
    "answer": "B",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "一、2"
  },
  {
    "id": 20041,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "栈与队列",
    "score": 2,
    "title": "对一个初始为空的栈 s 执行操作 Push(s,5)、\n                            Push(s,2)、\n                                     Push(s,4)、\n                                              Pop(s,x)、getTop(s,x)\n  后，x 的值应该是__________。",
    "options": [
      "5",
      "2",
      "4",
      "0"
    ],
    "answer": "B",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "一、3"
  },
  {
    "id": 20042,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "数据结构综合",
    "score": 2,
    "title": "为解决计算机主机与打印机之间速度不匹配的问题，通常设置一个打印数据缓冲\n  区。主机将要输出的数据依次写入该缓冲区，而打印机则依次从该缓冲区中取出\n  数据。该缓冲区的逻辑结构应该是____________。",
    "options": [
      "栈",
      "队列",
      "二叉树",
      "有向图"
    ],
    "answer": "B",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "一、4"
  },
  {
    "id": 20043,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "栈与队列",
    "score": 2,
    "title": "已知输入序列是 1234，则输入受限（仅允许一端输入）但输出不受限（两端均可\n  输出）的双端队列不可能得到的输出序列是____________。",
    "options": [
      "4231",
      "1324",
      "3214",
      "2341"
    ],
    "answer": "B",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "一、5"
  },
  {
    "id": 20044,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "树与二叉树",
    "score": 2,
    "title": "设完全二叉树的第 6 层有 24 个页节点，则此树最多有____________个节点",
    "options": [
      "55",
      "79",
      "81",
      "127"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "一、6"
  },
  {
    "id": 20045,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "树与二叉树",
    "score": 2,
    "title": "设 n、m 为一棵二叉树上的两个节点，在中序遍历时 n 在 m 前的条件是\n  ____________。",
    "options": [
      "n 在 m 的右方",
      "n 是 m 的祖先",
      "n 在 m 的左方",
      "n 是 m 的子孙"
    ],
    "answer": "C",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "一、7"
  },
  {
    "id": 20046,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "树与二叉树",
    "score": 2,
    "title": "设一棵二叉树的前序序列为 abdec，中序序列为 dbeac，则该二叉树后序遍历的顺\n  序是____________。",
    "options": [
      "abdec",
      "debac",
      "debca",
      "abedc"
    ],
    "answer": "C",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "一、8"
  },
  {
    "id": 20047,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "树与二叉树",
    "score": 2,
    "title": "在 Huffman 编码中，若编码长度只允许小于等于 4，则除了已对两个字符编码为\n  0 和 10 外，还可以最多对____________个字符编码",
    "options": [
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "B",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "一、9"
  },
  {
    "id": 20048,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "堆",
    "score": 2,
    "title": "在一个堆的顺序存储中，若一个节点的下标为 i（i >= 0），则它的左孩子节点的\n  下标为____________。",
    "options": [
      "2i－1",
      "2i",
      "2i＋1",
      "2i＋2"
    ],
    "answer": "C",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "一、10、14"
  },
  {
    "id": 20049,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "数据结构综合",
    "score": 2,
    "title": "一个有 n 个顶点的无向图最多有________条边",
    "options": [
      "n",
      "n(n-1)",
      "n(n-1)/2",
      "2n"
    ],
    "answer": "C",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "一、11"
  },
  {
    "id": 20050,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "排序",
    "score": 2,
    "title": "有一种排序方法，如果最小的元素位于待排序序列的最后，则在最后一趟排序开\n  始之前，所有元素都不在其最终位置上，这种排序方法是___________。",
    "options": [
      "直接插入排序",
      "简单选择排序",
      "冒泡排序",
      "快速排序"
    ],
    "answer": "A",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "一、12"
  },
  {
    "id": 20051,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "单选",
    "knowledgePoint": "数据结构综合",
    "score": 2,
    "title": "假定一三叉树的节点数为 50，则它的最小高度为___________。",
    "options": [
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "B",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "一、13"
  },

  // ===== 年份：2019 =====
  {
    "id": 20052,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2014,
      2019
    ],
    "type": "单选",
    "knowledgePoint": "数据结构综合",
    "score": 2,
    "title": "设 G 是一个非连通无向图，有 15 条边，则该图至少有____________个顶点。",
    "options": [
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "一、15",
    "sourceRefs": [
      {
        "source": "2013-2014B卷",
        "sourceQuestion": "一、15"
      },
      {
        "source": "2019考题",
        "sourceQuestion": "一-15"
      }
    ],
    "sourceNote": "重复题答案冲突，待复核"
  },

  // ===== 年份：2014 =====
  {
    "id": 20053,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "主观",
    "knowledgePoint": "树与二叉树",
    "score": 10,
    "title": "从空树开始，依次插入｛43,12,27,54,66,47,05,38｝构建一棵平衡二叉树，绘制建树过程。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "2"
  },
  {
    "id": 20054,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "主观",
    "knowledgePoint": "排序",
    "score": 8,
    "title": "给定随机序列｛43,71,86,13,38,60,27｝，利用直接插入排序算法排序，写出每一趟排序后的结果。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "3"
  },
  {
    "id": 20055,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "主观",
    "knowledgePoint": "树与二叉树",
    "score": 12,
    "title": "给定权值集合｛5,25,3,6,10,11,36,4｝，为其构造 Huffman 树。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "4"
  },
  {
    "id": 20056,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "主观",
    "knowledgePoint": "树与二叉树",
    "score": 10,
    "title": "对下面二叉树：1）指出根节点和叶节点；2）给出二叉树所表示的表达式；3）给出先序、中序、后序遍历结果。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "5",
    "images": [
      "/question-images/ds-2014-b-subjective-05.png"
    ]
  },
  {
    "id": 20057,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "主观",
    "knowledgePoint": "图",
    "score": 15,
    "title": "对图中的带权图：1）给出每个顶点的度；2）画出图的邻接链表；3）使用 Prim 算法求图的最小生成树。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "6",
    "images": [
      "/question-images/ds-2014-b-subjective-06.png"
    ]
  },
  {
    "id": 20058,
    "course": "数据结构",
    "year": 2014,
    "years": [
      2014
    ],
    "type": "主观",
    "knowledgePoint": "排序",
    "score": 15,
    "title": "设 A、B 是两个长度为 n 的整型数据的有序顺序表。如果把这2n个整数全部排序，位于第 n 个位置的整数称为中位数。编写时间复杂度为 O(log₂n) 的算法求 A 和 B 的中位数，写出算法思路并用代码实现。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2013-2014B卷",
    "sourceQuestion": "7"
  },

  // ===== 年份：2025 =====
  {
    "id": 20059,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "单选",
    "knowledgePoint": "查找",
    "score": 2,
    "title": "以下哪种结构，按值查找的平均时间复杂度性能最好？",
    "options": [
      "二叉查找树",
      "哈希表",
      "优先队列",
      "队列"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "1"
  },
  {
    "id": 20060,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "单选",
    "knowledgePoint": "栈",
    "score": 2,
    "title": "如果按照从小到大的顺序入栈，那么以下哪个序列不是合法的出栈序列？",
    "options": [
      "1, 2, 5, 4, 3",
      "11, 9, 72, 82, 99",
      "69, 25, 52, 67, 79",
      "11, 31, 54, 44, 99"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "2"
  },
  {
    "id": 20061,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "单选",
    "knowledgePoint": "树",
    "score": 2,
    "title": "下列关于树的描述错误的是？",
    "options": [
      "一个具有10个元素的序列，插入一个初始为空的BST，该树的高度和序列的值插入的顺序相关",
      "一个具有10个元素的序列，以任意顺序插入一个初始为空的4阶B树，最终树的高度一定相同",
      "一个具有10个元素的序列，以任意顺序插入一个初始为空的AVL树，最终树的高度一定相同",
      "一个具有9个元素的序列，以任意顺序插入一个初始为空的RB树，最终树的高度一定相同"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "3"
  },
  {
    "id": 20062,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "单选",
    "knowledgePoint": "线性表",
    "score": 2,
    "title": "对于一个只保存了头结点指针的单向链表，如果需要把一个长度为n的链表链接到另外一个长度为m的链表末尾，该操作的时间复杂度为？",
    "options": [
      "O(1)",
      "O(n)",
      "O(m)",
      "O(n+m)"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "4"
  },
  {
    "id": 20063,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "单选",
    "knowledgePoint": "图",
    "score": 2,
    "title": "一个无向连通图中有17条边，度为4的顶点有3个，度为3的顶点有6个，度为2的顶点有1个，则该图最多有多少个顶点？",
    "options": [
      "10",
      "11",
      "12",
      "13"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "5"
  },
  {
    "id": 20064,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "单选",
    "knowledgePoint": "图",
    "score": 2,
    "title": "若一个具有V个顶点、E条边的无向图，是一个森林（V>E），则该森林中树的个数为？",
    "options": [
      "V-E",
      "V",
      "E",
      "无法确定"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "6"
  },
  {
    "id": 20065,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "单选",
    "knowledgePoint": "B树",
    "score": 2,
    "title": "关于B树，描述错误的是？",
    "options": [
      "成功在B树插入的新值，一定在最下层的叶结点上。",
      "K阶B树说明每个结点最多能有K个孩子，并保存K-1个关键字",
      "任意阶的B树，保存了N个关键字，无论树高为多少，外部结点个数一定为N+1",
      "保存了N个关键字的B树，检索操作的时间复杂度为O(logN)"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "7"
  },
  {
    "id": 20066,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "单选",
    "knowledgePoint": "图",
    "score": 2,
    "title": "关于连通的带权无向图描述错误的是？",
    "options": [
      "带权无向图的最小支撑树可能不唯一",
      "通过深度优先遍历可以得到任意带权无向图的最小支撑树",
      "通过宽度优先遍历可以得到边权值全部相同的图的一个最小支撑树",
      "通过任何有效算法得到的最小支撑树的边权之和一定相等"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "8"
  },
  {
    "id": 20067,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "单选",
    "knowledgePoint": "数组",
    "score": 2,
    "title": "设矩阵A是一个对角线全为0的对称矩阵，为了节省存储，将其下三角部分按行序存放在一维数组B[1..n(n-1)/2]中，对于下三角部分中任一矩阵元素a(i,j)（i>j），在一维数组B的下标位置k的值是？",
    "options": [
      "(i*(i+1)/2)+j+1-i",
      "(i*(i-1)/2)+j-i",
      "(i*(i-1)/2)+j+1-i",
      "(i*(i+1)/2)+j-i"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "9"
  },
  {
    "id": 20068,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "单选",
    "knowledgePoint": "堆",
    "score": 2,
    "title": "以下哪个数组不是堆？",
    "options": [
      "9, 7, 5, 1, 2, 6, 3",
      "9, 7, 6, 5, 4, 3, 2",
      "74, 34, 65, 30, 29, 58, 28",
      "28, 34, 29, 74, 65, 58, 30"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "10"
  },
  {
    "id": 20069,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "判断",
    "knowledgePoint": "线性表",
    "score": 1,
    "title": "线性表采用顺序存储插入和删除操作的时间复杂度均为O(1)。",
    "options": [
      "正确",
      "错误"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "11"
  },
  {
    "id": 20070,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "判断",
    "knowledgePoint": "字符串",
    "score": 1,
    "title": "KMP作为一种高效的字符串匹配算法，其时间复杂度为O(n+m)，n为主串长度，m为模式字符串长度。",
    "options": [
      "正确",
      "错误"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "12"
  },
  {
    "id": 20071,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "判断",
    "knowledgePoint": "红黑树",
    "score": 1,
    "title": "红黑树插入的新结点初始颜色应为红色。",
    "options": [
      "正确",
      "错误"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "13"
  },
  {
    "id": 20072,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "判断",
    "knowledgePoint": "哈夫曼树",
    "score": 1,
    "title": "含N个结点的二叉哈夫曼树，其叶子结点个数无法确定。",
    "options": [
      "正确",
      "错误"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "14"
  },
  {
    "id": 20073,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "判断",
    "knowledgePoint": "图",
    "score": 1,
    "title": "如果e1是连通的有权无向图G唯一的一条最短边，则边e1一定会在该图的最小生成树上。",
    "options": [
      "正确",
      "错误"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "15"
  },
  {
    "id": 20074,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "判断",
    "knowledgePoint": "图",
    "score": 1,
    "title": "关键路径是AOE网中从源点到汇点的最短路径。",
    "options": [
      "正确",
      "错误"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "16"
  },
  {
    "id": 20075,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "判断",
    "knowledgePoint": "图",
    "score": 1,
    "title": "依照图顶点的拓扑排序算法，可以判断图中是否存在环。",
    "options": [
      "正确",
      "错误"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "17"
  },
  {
    "id": 20076,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "判断",
    "knowledgePoint": "图",
    "score": 1,
    "title": "用邻接链表法存储图，占用的存储空间数只与图中结点个数有关，与边数无关。",
    "options": [
      "正确",
      "错误"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "18"
  },
  {
    "id": 20077,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "判断",
    "knowledgePoint": "排序",
    "score": 1,
    "title": "希尔排序一趟排序结束后，每个元素可能都不在完成全部排序后的最终位置上。",
    "options": [
      "正确",
      "错误"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "19"
  },
  {
    "id": 20078,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "判断",
    "knowledgePoint": "排序",
    "score": 1,
    "title": "冒泡排序一趟排序结束后，至少1个元素在完成全部排序后的最终位置上。",
    "options": [
      "正确",
      "错误"
    ],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "20"
  },
  {
    "id": 20079,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "主观",
    "knowledgePoint": "图",
    "score": 2,
    "title": "图的宽度优先遍历可以借助队列结构实现，深度优先遍历可以借助____结构实现。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "21",
    "subType": "填空"
  },
  {
    "id": 20080,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "主观",
    "knowledgePoint": "排序",
    "score": 2,
    "title": "基于比较的排序时间复杂度最优情况下，使用渐进函数可以表示为____。（n为待排序元素的个数）。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "22",
    "subType": "填空"
  },
  {
    "id": 20081,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "主观",
    "knowledgePoint": "时间复杂度",
    "score": 4,
    "title": "请仔细阅读代码写出其执行的渐进时间复杂度，并进行分析。（n>1）",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "26",
    "images": [
      "/question-images/ds-2025-a-q26-code.png"
    ],
    "subType": "简答"
  },
  {
    "id": 20082,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "主观",
    "knowledgePoint": "二叉树",
    "score": 14,
    "title": "请根据下面二叉树的前序遍历、中序遍历、后序遍历（其中有一部分未显示出来），请补充写出3种遍历的序列，并画出该二叉树。请在答题卡中，把补充填写的结点编号下面加上横线或者圈出。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "27",
    "images": [
      "/question-images/ds-2025-a-q27-sequences.png"
    ],
    "subType": "简答"
  },
  {
    "id": 20083,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "主观",
    "knowledgePoint": "图",
    "score": 14,
    "title": "根据右图有向图，完成以下要求。1）请判断该图是否为强连通图，并说明理由。2）基于Dijkstra算法，写出从V2到其他顶点的最短路径。请按算法生成顺序写出最短路径，并写出路径长度。（请写出求取过程）",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "28",
    "images": [
      "/question-images/ds-2025-a-q28-graph.png"
    ],
    "subType": "简答"
  },
  {
    "id": 20084,
    "course": "数据结构",
    "year": 2025,
    "years": [
      2025
    ],
    "type": "主观",
    "knowledgePoint": "线性表",
    "score": 18,
    "title": "采用单向链表形式存储的字符串，请设计一个线性时间复杂度的算法求字符串的最大相同后缀，并如下图进行合并存储。（如果不能满足线性时间复杂度最高分15分）",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2024-2025A卷",
    "sourceQuestion": "29",
    "images": [
      "/question-images/ds-2025-a-q29-list.png"
    ],
    "subType": "综合"
  },

  // ===== 年份：2019 =====
  {
    "id": 20085,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "单选",
    "knowledgePoint": "线性表",
    "score": 2,
    "title": "在长度为 n 的顺序表中插入一个元素，需要平均移动（ ）个元素。",
    "options": [
      "n",
      "(n+1)/2",
      "(n-1)/2",
      "n/2"
    ],
    "answer": "D",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "一-1",
    "images": [],
    "answerSource": "2019考题有答案.pdf 手写标注（非官方，未独立核验）"
  },
  {
    "id": 20086,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "单选",
    "knowledgePoint": "线性表",
    "score": 2,
    "title": "以下关于头结点的描述中，叙述错误的是（ ）。",
    "options": [
      "在单链表中附设头结点，插入或删除首元素时不必进行特殊处理",
      "若链表中附设头结点，则头指针一定不为空",
      "头结点中一般不存储链表的数据元素，而是一些诸如表长之类的辅助信息",
      "头结点是对链表首元结点的别称"
    ],
    "answer": "D",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "一-2",
    "images": [],
    "answerSource": "2019考题有答案.pdf 手写标注（非官方，未独立核验）"
  },
  {
    "id": 20087,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "单选",
    "knowledgePoint": "栈和队列",
    "score": 2,
    "title": "设有栈 S 和队列 Q，其初始状态为空，元素 1,2,3,4,5,6 依次入栈，出栈的元素进入队列 Q。若元素出队列的顺序是 2,4,3,6,5,1，则栈的容量至少是（ ）。",
    "options": [
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "B",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "一-3",
    "images": [],
    "answerSource": "2019考题有答案.pdf 手写标注（非官方，未独立核验）"
  },
  {
    "id": 20088,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "单选",
    "knowledgePoint": "数组",
    "score": 2,
    "title": "已知二维数组 A[9][7] 按行主存放，其起始存储位置为 1000，每个元素占用 4 个字节，则元素 A[4][6] 的起始地址为（ ）。",
    "options": [
      "1032",
      "1034",
      "1136",
      "1140"
    ],
    "answer": "C",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "一-4",
    "images": [],
    "answerSource": "2019考题有答案.pdf 手写标注（非官方，未独立核验）"
  },
  {
    "id": 20089,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "单选",
    "knowledgePoint": "二叉树",
    "score": 2,
    "title": "二叉树的叶结点在前序、中序、后序遍历的相对顺序？（ ）。",
    "options": [
      "一定不会变化",
      "一定发生变化",
      "不能确定",
      "以上均不正确"
    ],
    "answer": "A",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "一-5",
    "images": [],
    "answerSource": "2019考题有答案.pdf 手写标注（非官方，未独立核验）"
  },
  {
    "id": 20090,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "单选",
    "knowledgePoint": "平衡二叉树",
    "score": 2,
    "title": "【叶结点高度为 1】高度为 5 的 AVL 树，最少的结点个数为？（ ）。",
    "options": [
      "20",
      "17",
      "12",
      "不能确定"
    ],
    "answer": "C",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "一-6",
    "images": [],
    "answerSource": "2019考题有答案.pdf 手写标注（非官方，未独立核验）"
  },
  {
    "id": 20091,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "单选",
    "knowledgePoint": "哈夫曼树",
    "score": 2,
    "title": "设哈夫曼编码长度不超过 5，如果已对两个字符编码为 0,10，则还可以最多给多少个字符编码？（ ）。",
    "options": [
      "4",
      "8",
      "16",
      "不能确定"
    ],
    "answer": "B",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "一-7",
    "images": [],
    "sourceNote": "答案版红笔更正为 B",
    "answerSource": "2019考题有答案.pdf 手写标注（非官方，未独立核验）"
  },
  {
    "id": 20092,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "单选",
    "knowledgePoint": "树",
    "score": 2,
    "title": "以下哪种树的高度与插入的数据顺序无关（ ）。",
    "options": [
      "AVL 树",
      "B 树",
      "二叉搜索树",
      "最小堆"
    ],
    "answer": "D",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "一-8",
    "images": [],
    "answerSource": "2019考题有答案.pdf 手写标注（非官方，未独立核验）"
  },
  {
    "id": 20093,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "单选",
    "knowledgePoint": "查找",
    "score": 2,
    "title": "有序表中有 1000 个元素，则用二分查找法，成功查找元素 A 最多需要比较（ ）次。",
    "options": [
      "8",
      "9",
      "10",
      "11"
    ],
    "answer": "C",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "一-9",
    "images": [],
    "answerSource": "2019考题有答案.pdf 手写标注（非官方，未独立核验）"
  },
  {
    "id": 20094,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "单选",
    "knowledgePoint": "B树",
    "score": 2,
    "title": "一棵 m 阶 B-树，高度为 h（外部结点高度为 0，叶结点高度为 1），外部结点个数为 n，那么该树共有（ ）个关键字。",
    "options": [
      "n-1",
      "n",
      "mh-1",
      "mh"
    ],
    "answer": "A",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "一-10",
    "images": [],
    "sourceNote": "答案版红笔更正为 A",
    "answerSource": "2019考题有答案.pdf 手写标注（非官方，未独立核验）"
  },
  {
    "id": 20095,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "单选",
    "knowledgePoint": "排序",
    "score": 2,
    "title": "对一趟排序序列分别进行折半插入排序和直接插入排序，两者之间可能的不同之处是（ ）。",
    "options": [
      "排序的渐进时间复杂度",
      "元素之间的比较次数",
      "元素的移动次数",
      "辅助空间的渐进时间复杂度"
    ],
    "answer": "B",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "一-11",
    "images": [],
    "answerSource": "2019考题有答案.pdf 手写标注（非官方，未独立核验）"
  },
  {
    "id": 20096,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "单选",
    "knowledgePoint": "图",
    "score": 2,
    "title": "一个有 n 个顶点的无向图，其中边数大于 n-1，那么下面说法正确的是（ ）。",
    "options": [
      "该图一定是连通图",
      "该图一定是非连通图",
      "该图一定是完全图",
      "该图一定不是树"
    ],
    "answer": "D",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "一-12",
    "images": [],
    "answerSource": "2019考题有答案.pdf 手写标注（非官方，未独立核验）"
  },
  {
    "id": 20097,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "单选",
    "knowledgePoint": "哈希表",
    "score": 2,
    "title": "以下关于哈希表的描述错误的是（ ）。",
    "options": [
      "哈希表的理想查找、插入、删除的时间复杂度均为 O(n)",
      "通常哈希表的实际性能与填充率相关",
      "开放定址的平方探测有可能在有空桶的情况下也无法插入新值",
      "极端情况下，哈希表的性能可能退化为 O(n)"
    ],
    "answer": "A",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "一-13",
    "images": [],
    "sourceNote": "答案版红笔更正为 A",
    "answerSource": "2019考题有答案.pdf 手写标注（非官方，未独立核验）"
  },
  {
    "id": 20098,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "单选",
    "knowledgePoint": "排序",
    "score": 2,
    "title": "以下哪个算法在最好情况下的算法时间复杂度为 O(n)（ ）。",
    "options": [
      "快速排序",
      "归并排序",
      "插入排序",
      "堆排序"
    ],
    "answer": "C",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "一-14",
    "images": [],
    "answerSource": "2019考题有答案.pdf 手写标注（非官方，未独立核验）"
  },
  {
    "id": 20100,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "主观",
    "knowledgePoint": "时间复杂度",
    "score": 3,
    "title": "仔细阅读代码并分析其渐进时间复杂度，写出分析过程。（n>1）【原资料缺少代码】",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "二-1",
    "images": [],
    "subType": "简答",
    "sourceNote": "答案版仅有手写 k(k+1)/2=n、k=√n，代码缺失，未作为完整答案。"
  },
  {
    "id": 20101,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "主观",
    "knowledgePoint": "时间复杂度",
    "score": 9,
    "title": "仔细阅读代码并分析三种算法的时间复杂度，写出分析过程。（e>=1）【原资料缺少代码】",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "二-2",
    "images": [],
    "subType": "简答",
    "sourceNote": "原资料缺少三种算法代码。"
  },
  {
    "id": 20102,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "主观",
    "knowledgePoint": "二叉树",
    "score": 6,
    "title": "完全二叉树的中序遍历为 ABCDEFGHIJK（每个字母代表一个结点），请画出该树，并写出该树的前序遍历和后序遍历。",
    "options": [],
    "answer": "前序：HDBACFEGJIK；后序：ACBEGFDIKJH（原卷手写标注）",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "二-3",
    "images": [],
    "subType": "简答",
    "answerSource": "2019考题有答案.pdf 手写标注（非官方，未独立核验）"
  },
  {
    "id": 20103,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "主观",
    "knowledgePoint": "图",
    "score": 14,
    "title": "有向图如下图所示。请回答以下问题：\n1）该图是否为 AOE 网？说明原因（3分）。\n2）合法的拓扑排序个数为？（1分）请写出其中4个合法的拓扑排序（4分）。\n3）是否存在关键路径，如果不存在请说明原因，如果存在请写出关键路径长度和经过的顶点（3分）。\n4）请忽略有向图的方向，画出图的最小支撑树，标明边权值和顶点（3分）。\n【原资料缺少有向图】",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "二-4",
    "images": [],
    "subType": "简答",
    "sourceNote": "有答案版和无答案版均缺图。"
  },
  {
    "id": 20104,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "主观",
    "knowledgePoint": "平衡二叉树",
    "score": 8,
    "title": "关键字值：16，20，21，34，3，8，12，5。请绘制按序列顺序插入21后、插入8后以及全部插入后的3棵 AVL 树，并计算全部插入后的成功和不成功的平均查找长度。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "二-5",
    "images": [],
    "subType": "简答",
    "sourceNote": "答案版有手写树和计算，但未能可靠转录完整答案。"
  },
  {
    "id": 20105,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "主观",
    "knowledgePoint": "二叉搜索树",
    "score": 14,
    "title": "假设树采用二叉链表存储，结点结构为 struct node{node * lchild; int key; node * rchild};。请设计一个算法判断该树是否为二叉搜索树。\n要求：1）给出算法的基本设计思想（5分）。\n2）根据设计思想采用 C 或者 C++ 实现，关键之处给出注释，传入参数为 root 结点（5分）。\n3）说明设计算法的时间复杂度（4分）。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "三-1",
    "images": [],
    "subType": "综合"
  },
  {
    "id": 20106,
    "course": "数据结构",
    "year": 2019,
    "years": [
      2019
    ],
    "type": "主观",
    "knowledgePoint": "图",
    "score": 16,
    "title": "如果用图来表示铁路交通网络系统，顶点表示站点。假设任意直接相连的两个站点只有一种交通方案（例如：只有一个车次）的情况下。请设计相应的数据结构和算法求出下面问题的解决方案。\ni. 求站点和站点之间中转次数最少的路线。\nii. 求站点和站点之间费用最小的路线。\n1）请写出求解不同问题数据结构的存储方案，并说明原因（6分）。\n2）请写出根据设计的数据结构进行某两个站点求解的算法实现（伪代码既可，6分）。\n3）如果直接相连的站点之间有多种交通（连接）方案（多个车次）。您设计的结构是否仍能支持以上两个问题的求解，如果支持请说明实现方法，如果不支持请说明是否有替代或修改方案（4分）。",
    "options": [],
    "answer": "无",
    "explanation": "无",
    "source": "2019考题",
    "sourceQuestion": "三-2",
    "images": [],
    "subType": "综合"
  },
]
