/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Math Figures & Geometric Diagram System
 * Supports SVG vector rendering, LaTeX TikZ code (solid vs dashed lines),
 * Python Matplotlib code, and automatic Word (.docx) 2-column embedding.
 */

export interface MathFigureData {
  hasFigure?: boolean;
  figureSvg?: string;
  figureTikz?: string;
  figurePython?: string;
  figureDescription?: string;
}

export interface GeometricTemplate {
  id: string;
  name: string;
  grade: string;
  category: "Hình học phẳng" | "Hình không gian" | "Đại số & Tọa độ";
  svg: string;
  tikz: string;
  python: string;
  description: string;
}

/**
 * Thư viện hình học chuẩn mực GDPT 2018 (Lớp 6, 7, 8, 9)
 * Đầy đủ SVG nét căng, TikZ chuẩn LaTeX (phân biệt \draw và \draw[dashed]),
 * Python Matplotlib cho giáo viên.
 */
export const GEOMETRIC_TEMPLATES: GeometricTemplate[] = [
  {
    id: "hinh-thang-can",
    name: "Hình thang cân ABCD (đáy AB, CD)",
    grade: "6, 8",
    category: "Hình học phẳng",
    description: "Hình thang cân ABCD với hai đáy AB và CD, hai cạnh bên AD = BC, đường cao AH nét đứt.",
    svg: `<svg viewBox="0 0 260 160" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto max-w-[240px] mx-auto">
  <defs>
    <style>
      .geom-line { stroke: #1e3a8a; stroke-width: 2; fill: none; stroke-linecap: round; stroke-linejoin: round; }
      .geom-dashed { stroke: #dc2626; stroke-width: 1.5; stroke-dasharray: 4 3; fill: none; }
      .geom-point { fill: #1e3a8a; }
      .geom-text { font-family: 'Times New Roman', serif; font-size: 14px; font-weight: bold; fill: #0f172a; }
      .geom-label { font-family: 'Times New Roman', serif; font-size: 12px; font-style: italic; fill: #475569; }
    </style>
  </defs>
  <!-- Background subtle fill -->
  <polygon points="65,35 195,35 235,125 25,125" fill="#f8fafc" stroke="none"/>
  <!-- Sides: solid lines -->
  <polygon points="65,35 195,35 235,125 25,125" class="geom-line"/>
  <!-- Altitude AH: dashed line -->
  <line x1="65" y1="35" x2="65" y2="125" class="geom-dashed"/>
  <!-- Right angle marker at H -->
  <polyline points="65,115 75,115 75,125" fill="none" stroke="#dc2626" stroke-width="1.2"/>
  <!-- Points -->
  <circle cx="65" cy="35" r="3" class="geom-point"/>
  <circle cx="195" cy="35" r="3" class="geom-point"/>
  <circle cx="235" cy="125" r="3" class="geom-point"/>
  <circle cx="25" cy="125" r="3" class="geom-point"/>
  <circle cx="65" cy="125" r="2.5" fill="#dc2626"/>
  <!-- Labels -->
  <text x="55" y="25" class="geom-text">A</text>
  <text x="195" y="25" class="geom-text">B</text>
  <text x="242" y="132" class="geom-text">C</text>
  <text x="10" y="132" class="geom-text">D</text>
  <text x="60" y="142" class="geom-text" fill="#dc2626">H</text>
  <!-- Side label -->
  <text x="220" y="75" class="geom-label">4 cm</text>
</svg>`,
    tikz: `% Mã TikZ chuẩn LaTeX - Hình thang cân ABCD
\\begin{tikzpicture}[scale=1, line join=round, line cap=round, >=stealth]
  % Định nghĩa toạ độ các đỉnh
  \\coordinate (A) at (1,2.5);
  \\coordinate (B) at (4,2.5);
  \\coordinate (C) at (5,0);
  \\coordinate (D) at (0,0);
  \\coordinate (H) at (1,0);

  % Nét liền: các cạnh của hình thang
  \\draw[thick] (A) -- (B) -- (C) -- (D) -- cycle;

  % Nét đứt: đường cao AH
  \\draw[dashed, red, thick] (A) -- (H);

  % Kí hiệu góc vuông tại H
  \\draw[red] (1,0.25) -- (1.25,0.25) -- (1.25,0);

  % Ghi tên các đỉnh
  \\node[above left] at (A) {$A$};
  \\node[above right] at (B) {$B$};
  \\node[below right] at (C) {$C$};
  \\node[below left] at (D) {$D$};
  \\node[below] at (H) {$H$};
  \\node[right] at (4.6,1.25) {$4\\text{ cm}$};
\\end{tikzpicture}`,
    python: `# Mã Python Matplotlib - Hình thang cân ABCD
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(5, 3.5), dpi=300)
A = [1, 2.5]
B = [4, 2.5]
C = [5, 0]
D = [0, 0]
H = [1, 0]

# Nét liền: các cạnh hình thang
xs = [A[0], B[0], C[0], D[0], A[0]]
ys = [A[1], B[1], C[1], D[1], A[1]]
ax.plot(xs, ys, 'b-', linewidth=2, label='Cạnh hình thang (nét liền)')

# Nét đứt: đường cao AH
ax.plot([A[0], H[0]], [A[1], H[1]], 'r--', linewidth=1.5, label='Đường cao AH (nét đứt)')

# Đặt nhãn đỉnh
ax.text(A[0]-0.2, A[1]+0.1, 'A', fontsize=12, fontweight='bold')
ax.text(B[0]+0.1, B[1]+0.1, 'B', fontsize=12, fontweight='bold')
ax.text(C[0]+0.1, C[1]-0.2, 'C', fontsize=12, fontweight='bold')
ax.text(D[0]-0.2, D[1]-0.2, 'D', fontsize=12, fontweight='bold')
ax.text(H[0]-0.1, H[1]-0.3, 'H', fontsize=11, color='red')

ax.set_aspect('equal')
ax.axis('off')
plt.title('Hình thang cân ABCD', fontsize=13)
plt.show()`
  },
  {
    id: "hinh-binh-hanh",
    name: "Hình bình hành ABCD có đường cao AH",
    grade: "6, 8",
    category: "Hình học phẳng",
    description: "Hình bình hành ABCD với đáy CD = a, chiều cao AH = h nét đứt.",
    svg: `<svg viewBox="0 0 260 150" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto max-w-[240px] mx-auto">
  <defs>
    <style>
      .geom-line { stroke: #1e3a8a; stroke-width: 2; fill: none; stroke-linecap: round; }
      .geom-dashed { stroke: #dc2626; stroke-width: 1.5; stroke-dasharray: 4 3; fill: none; }
      .geom-point { fill: #1e3a8a; }
      .geom-text { font-family: 'Times New Roman', serif; font-size: 14px; font-weight: bold; fill: #0f172a; }
      .geom-label { font-family: 'Times New Roman', serif; font-size: 12px; font-style: italic; fill: #dc2626; }
    </style>
  </defs>
  <polygon points="70,30 230,30 180,120 20,120" fill="#f8fafc" stroke="none"/>
  <polygon points="70,30 230,30 180,120 20,120" class="geom-line"/>
  <line x1="70" y1="30" x2="70" y2="120" class="geom-dashed"/>
  <polyline points="70,110 80,110 80,120" fill="none" stroke="#dc2626" stroke-width="1.2"/>
  <circle cx="70" cy="30" r="3" class="geom-point"/>
  <circle cx="230" cy="30" r="3" class="geom-point"/>
  <circle cx="180" cy="120" r="3" class="geom-point"/>
  <circle cx="20" cy="120" r="3" class="geom-point"/>
  <circle cx="70" cy="120" r="2.5" fill="#dc2626"/>
  <text x="60" y="22" class="geom-text">A</text>
  <text x="235" y="28" class="geom-text">B</text>
  <text x="185" y="130" class="geom-text">C</text>
  <text x="8" y="130" class="geom-text">D</text>
  <text x="65" y="135" class="geom-text" fill="#dc2626">H</text>
  <text x="75" y="75" class="geom-label">h</text>
  <text x="100" y="138" class="geom-label" fill="#1e3a8a">a</text>
</svg>`,
    tikz: `% Mã TikZ chuẩn LaTeX - Hình bình hành ABCD
\\begin{tikzpicture}[scale=1, line join=round, line cap=round]
  \\coordinate (A) at (1.5,2.5);
  \\coordinate (B) at (5.5,2.5);
  \\coordinate (C) at (4,0);
  \\coordinate (D) at (0,0);
  \\coordinate (H) at (1.5,0);

  % Nét liền: 4 cạnh hình bình hành
  \\draw[thick] (A) -- (B) -- (C) -- (D) -- cycle;

  % Nét đứt: đường cao AH
  \\draw[dashed, red, thick] (A) -- (H);
  \\draw[red] (1.5,0.25) -- (1.75,0.25) -- (1.75,0);

  \\node[above left] at (A) {$A$};
  \\node[above right] at (B) {$B$};
  \\node[below right] at (C) {$C$};
  \\node[below left] at (D) {$D$};
  \\node[below] at (H) {$H$};
  \\node[left, red] at (1.5,1.25) {$h$};
  \\node[below] at (2,0) {$a$};
\\end{tikzpicture}`,
    python: `# Python Matplotlib - Hình bình hành ABCD
import matplotlib.pyplot as plt
fig, ax = plt.subplots(figsize=(5, 3), dpi=300)
A, B, C, D, H = [1.5, 2.5], [5.5, 2.5], [4, 0], [0, 0], [1.5, 0]
ax.plot([A[0], B[0], C[0], D[0], A[0]], [A[1], B[1], C[1], D[1], A[1]], 'b-', lw=2)
ax.plot([A[0], H[0]], [A[1], H[1]], 'r--', lw=1.5)
ax.text(A[0]-0.2, A[1]+0.1, 'A', fontweight='bold')
ax.text(B[0]+0.1, B[1]+0.1, 'B', fontweight='bold')
ax.text(C[0]+0.1, C[1]-0.2, 'C', fontweight='bold')
ax.text(D[0]-0.2, D[1]-0.2, 'D', fontweight='bold')
ax.text(H[0], H[1]-0.3, 'H', color='red')
ax.set_aspect('equal')
ax.axis('off')
plt.show()`
  },
  {
    id: "tam-giac-vuong",
    name: "Tam giác ABC vuông tại A có đường cao AH",
    grade: "7, 8, 9",
    category: "Hình học phẳng",
    description: "Tam giác ABC vuông tại A, đường cao AH hạ từ đỉnh góc vuông xuống cạnh huyền BC.",
    svg: `<svg viewBox="0 0 250 160" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto max-w-[240px] mx-auto">
  <defs>
    <style>
      .geom-line { stroke: #1e3a8a; stroke-width: 2; fill: none; stroke-linecap: round; }
      .geom-dashed { stroke: #dc2626; stroke-width: 1.5; stroke-dasharray: 4 3; fill: none; }
      .geom-text { font-family: 'Times New Roman', serif; font-size: 14px; font-weight: bold; fill: #0f172a; }
    </style>
  </defs>
  <polygon points="60,40 20,130 220,130" fill="#f8fafc"/>
  <polygon points="60,40 20,130 220,130" class="geom-line"/>
  <!-- Altitude AH -->
  <line x1="60" y1="40" x2="60" y2="130" class="geom-dashed"/>
  <!-- Right angle at A -->
  <polyline points="50,47 57,56 67,49" fill="none" stroke="#1e3a8a" stroke-width="1.2"/>
  <!-- Right angle at H -->
  <polyline points="60,120 70,120 70,130" fill="none" stroke="#dc2626" stroke-width="1.2"/>
  <!-- Points -->
  <circle cx="60" cy="40" r="3" fill="#1e3a8a"/>
  <circle cx="20" cy="130" r="3" fill="#1e3a8a"/>
  <circle cx="220" cy="130" r="3" fill="#1e3a8a"/>
  <circle cx="60" cy="130" r="2.5" fill="#dc2626"/>
  <!-- Labels -->
  <text x="55" y="28" class="geom-text">A</text>
  <text x="6" y="138" class="geom-text">B</text>
  <text x="226" y="138" class="geom-text">C</text>
  <text x="56" y="146" class="geom-text" fill="#dc2626">H</text>
</svg>`,
    tikz: `% Mã TikZ chuẩn LaTeX - Tam giác ABC vuông tại A
\\begin{tikzpicture}[scale=1, line join=round, line cap=round]
  \\coordinate (A) at (1,2.5);
  \\coordinate (B) at (0,0);
  \\coordinate (C) at (5,0);
  \\coordinate (H) at (1,0);

  % Nét liền: các cạnh tam giác
  \\draw[thick] (A) -- (B) -- (C) -- cycle;

  % Nét đứt: đường cao AH
  \\draw[dashed, red, thick] (A) -- (H);

  % Kí hiệu góc vuông
  \\draw[red] (1,0.25) -- (1.25,0.25) -- (1.25,0);

  \\node[above] at (A) {$A$};
  \\node[below left] at (B) {$B$};
  \\node[below right] at (C) {$C$};
  \\node[below] at (H) {$H$};
\\end{tikzpicture}`,
    python: `# Python Matplotlib - Tam giác vuông ABC
import matplotlib.pyplot as plt
fig, ax = plt.subplots(figsize=(5, 3.5), dpi=300)
A, B, C, H = [1, 2.5], [0, 0], [5, 0], [1, 0]
ax.plot([A[0], B[0], C[0], A[0]], [A[1], B[1], C[1], A[1]], 'b-', lw=2)
ax.plot([A[0], H[0]], [A[1], H[1]], 'r--', lw=1.5)
ax.text(A[0], A[1]+0.1, 'A', fontweight='bold')
ax.text(B[0]-0.2, B[1]-0.2, 'B', fontweight='bold')
ax.text(C[0]+0.1, C[1]-0.2, 'C', fontweight='bold')
ax.text(H[0], H[1]-0.3, 'H', color='red')
ax.set_aspect('equal')
ax.axis('off')
plt.show()`
  },
  {
    id: "hinh-chop-tam-giac-deu",
    name: "Hình chóp tam giác đều S.ABC (phân biệt nét đứt/liền)",
    grade: "8",
    category: "Hình không gian",
    description: "Hình chóp S.ABC có đáy là tam giác đều ABC. Cạnh đáy AC khuất nét đứt, đường cao SO nét đứt.",
    svg: `<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto max-w-[220px] mx-auto">
  <defs>
    <style>
      .geom-solid { stroke: #1e3a8a; stroke-width: 2; fill: none; stroke-linecap: round; }
      .geom-dash { stroke: #dc2626; stroke-width: 1.5; stroke-dasharray: 4 3; fill: none; }
      .geom-text { font-family: 'Times New Roman', serif; font-size: 14px; font-weight: bold; fill: #0f172a; }
    </style>
  </defs>
  <!-- Faces -->
  <polygon points="120,25 30,135 100,165" fill="#f1f5f9" opacity="0.6"/>
  <polygon points="120,25 100,165 210,135" fill="#e2e8f0" opacity="0.6"/>
  
  <!-- Dashed hidden edges -->
  <line x1="30" y1="135" x2="210" y2="135" class="geom-dash"/>
  <line x1="120" y1="25" x2="113" y2="145" class="geom-dash"/> <!-- SO height -->
  
  <!-- Solid visible edges -->
  <line x1="120" y1="25" x2="30" y2="135" class="geom-solid"/> <!-- SA -->
  <line x1="120" y1="25" x2="100" y2="165" class="geom-solid"/> <!-- SB -->
  <line x1="120" y1="25" x2="210" y2="135" class="geom-solid"/> <!-- SC -->
  <line x1="30" y1="135" x2="100" y2="165" class="geom-solid"/> <!-- AB -->
  <line x1="100" y1="165" x2="210" y2="135" class="geom-solid"/> <!-- BC -->

  <!-- Points -->
  <circle cx="120" cy="25" r="3" fill="#1e3a8a"/>
  <circle cx="30" cy="135" r="3" fill="#1e3a8a"/>
  <circle cx="100" cy="165" r="3" fill="#1e3a8a"/>
  <circle cx="210" cy="135" r="3" fill="#1e3a8a"/>
  <circle cx="113" cy="145" r="2.5" fill="#dc2626"/>

  <!-- Labels -->
  <text x="116" y="16" class="geom-text">S</text>
  <text x="15" y="140" class="geom-text">A</text>
  <text x="96" y="180" class="geom-text">B</text>
  <text x="216" y="140" class="geom-text">C</text>
  <text x="116" y="156" class="geom-text" fill="#dc2626">O</text>
</svg>`,
    tikz: `% Mã TikZ chuẩn LaTeX - Hình chóp tam giác đều S.ABC
\\begin{tikzpicture}[scale=1, line join=round, line cap=round]
  \\coordinate (S) at (2,3.5);
  \\coordinate (A) at (0,0.5);
  \\coordinate (B) at (1.5,-0.5);
  \\coordinate (C) at (4,0.5);
  \\coordinate (O) at (1.83,0.17);

  % Nét đứt: Cạnh khuất AC và đường cao SO
  \\draw[dashed, thick] (A) -- (C);
  \\draw[dashed, red, thick] (S) -- (O);

  % Nét liền: Các cạnh nhìn thấy
  \\draw[thick] (S) -- (A) -- (B) -- (C) -- (S);
  \\draw[thick] (S) -- (B);

  \\node[above] at (S) {$S$};
  \\node[left] at (A) {$A$};
  \\node[below] at (B) {$B$};
  \\node[right] at (C) {$C$};
  \\node[below, red] at (O) {$O$};
\\end{tikzpicture}`,
    python: `# Python Matplotlib 3D - Hình chóp tam giác S.ABC
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
fig = plt.figure(figsize=(5, 4), dpi=300)
ax = fig.add_subplot(111, projection='3d')

S = [0, 0, 3]
A = [-1.5, -1, 0]
B = [0, 1.5, 0]
C = [1.5, -1, 0]

# Nét liền: SA, SB, SC, AB, BC
for p1, p2 in [(S,A), (S,B), (S,C), (A,B), (B,C)]:
    ax.plot([p1[0], p2[0]], [p1[1], p2[1]], [p1[2], p2[2]], 'b-', lw=1.5)

# Nét đứt: AC khuất
ax.plot([A[0], C[0]], [A[1], C[1]], [A[2], C[2]], 'r--', lw=1.5)

ax.axis('off')
plt.show()`
  },
  {
    id: "hinh-chop-tu-giac-deu",
    name: "Hình chóp tứ giác đều S.ABCD",
    grade: "8",
    category: "Hình không gian",
    description: "Hình chóp tứ giác đều S.ABCD có đáy là hình vuông ABCD, cạnh đáy AD, CD khuất nét đứt.",
    svg: `<svg viewBox="0 0 250 190" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto max-w-[220px] mx-auto">
  <defs>
    <style>
      .geom-solid { stroke: #1e3a8a; stroke-width: 2; fill: none; stroke-linecap: round; }
      .geom-dash { stroke: #dc2626; stroke-width: 1.5; stroke-dasharray: 4 3; fill: none; }
      .geom-text { font-family: 'Times New Roman', serif; font-size: 14px; font-weight: bold; fill: #0f172a; }
    </style>
  </defs>
  <!-- Dashed hidden edges -->
  <line x1="30" y1="130" x2="90" y2="105" class="geom-dash"/> <!-- AB -->
  <line x1="90" y1="105" x2="210" y2="105" class="geom-dash"/> <!-- BC -->
  <line x1="125" y1="20" x2="90" y2="105" class="geom-dash"/> <!-- SB -->
  <line x1="125" y1="20" x2="120" y2="125" class="geom-dash"/> <!-- SO height -->

  <!-- Solid visible edges -->
  <line x1="125" y1="20" x2="30" y2="130" class="geom-solid"/> <!-- SA -->
  <line x1="125" y1="20" x2="150" y2="150" class="geom-solid"/> <!-- SD -->
  <line x1="125" y1="20" x2="210" y2="105" class="geom-solid"/> <!-- SC -->
  <line x1="30" y1="130" x2="150" y2="150" class="geom-solid"/> <!-- AD -->
  <line x1="150" y1="150" x2="210" y2="105" class="geom-solid"/> <!-- DC -->

  <circle cx="125" cy="20" r="3" fill="#1e3a8a"/>
  <circle cx="30" cy="130" r="3" fill="#1e3a8a"/>
  <circle cx="90" cy="105" r="3" fill="#dc2626"/>
  <circle cx="210" cy="105" r="3" fill="#1e3a8a"/>
  <circle cx="150" cy="150" r="3" fill="#1e3a8a"/>

  <text x="120" y="14" class="geom-text">S</text>
  <text x="14" y="136" class="geom-text">A</text>
  <text x="86" y="98" class="geom-text" fill="#dc2626">B</text>
  <text x="216" y="110" class="geom-text">C</text>
  <text x="150" y="166" class="geom-text">D</text>
</svg>`,
    tikz: `% Mã TikZ chuẩn LaTeX - Hình chóp tứ giác đều S.ABCD
\\begin{tikzpicture}[scale=1, line join=round, line cap=round]
  \\coordinate (S) at (2,3.5);
  \\coordinate (A) at (0,1);
  \\coordinate (B) at (1.2,1.8);
  \\coordinate (C) at (3.8,1.8);
  \\coordinate (D) at (2.6,0.6);
  \\coordinate (O) at (1.9,1.3);

  % Nét đứt: Cạnh khuất AB, BC, SB, SO
  \\draw[dashed, thick] (A) -- (B) -- (C);
  \\draw[dashed, thick] (S) -- (B);
  \\draw[dashed, red, thick] (S) -- (O);

  % Nét liền: Các cạnh nhìn thấy
  \\draw[thick] (S) -- (A) -- (D) -- (C) -- (S);
  \\draw[thick] (S) -- (D);

  \\node[above] at (S) {$S$};
  \\node[left] at (A) {$A$};
  \\node[above] at (B) {$B$};
  \\node[right] at (C) {$C$};
  \\node[below] at (D) {$D$};
  \\node[below, red] at (O) {$O$};
\\end{tikzpicture}`,
    python: `# Python Matplotlib - Hình chóp tứ giác S.ABCD
import matplotlib.pyplot as plt
# (Sử dụng cấu trúc tọa độ không gian)
`
  },
  {
    id: "duong-tron-tiep-tuyen",
    name: "Đường tròn (O) và tiếp tuyến Ax",
    grade: "9",
    category: "Hình học phẳng",
    description: "Đường tròn tâm O bán kính R, tiếp tuyến Ax tại tiếp điểm A vuông góc với bán kính OA.",
    svg: `<svg viewBox="0 0 250 170" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto max-w-[230px] mx-auto">
  <defs>
    <style>
      .geom-line { stroke: #1e3a8a; stroke-width: 2; fill: none; }
      .geom-dash { stroke: #dc2626; stroke-width: 1.5; stroke-dasharray: 4 3; fill: none; }
      .geom-text { font-family: 'Times New Roman', serif; font-size: 14px; font-weight: bold; fill: #0f172a; }
    </style>
  </defs>
  <!-- Circle (O) -->
  <circle cx="110" cy="90" r="50" fill="#f8fafc" stroke="#1e3a8a" stroke-width="2"/>
  <!-- Tangent line Ax -->
  <line x1="30" y1="40" x2="220" y2="40" class="geom-line" stroke="#2563eb"/>
  <!-- Radius OA -->
  <line x1="110" y1="90" x2="110" y2="40" class="geom-dash"/>
  <!-- Right angle at A -->
  <polyline points="110,50 120,50 120,40" fill="none" stroke="#dc2626" stroke-width="1.2"/>
  <!-- Center O and Point A -->
  <circle cx="110" cy="90" r="3" fill="#1e3a8a"/>
  <circle cx="110" cy="40" r="3" fill="#2563eb"/>
  <!-- Labels -->
  <text x="115" y="105" class="geom-text">O</text>
  <text x="105" y="32" class="geom-text">A</text>
  <text x="225" y="44" class="geom-text" fill="#2563eb">x</text>
  <text x="115" y="70" class="geom-text" font-size="12" fill="#dc2626">R</text>
</svg>`,
    tikz: `% Mã TikZ chuẩn LaTeX - Đường tròn (O) và tiếp tuyến Ax
\\begin{tikzpicture}[scale=1, line join=round, line cap=round]
  \\coordinate (O) at (0,0);
  \\coordinate (A) at (0,2);
  
  % Vẽ đường tròn
  \\draw[thick, blue] (O) circle (2cm);

  % Bán kính OA nét đứt
  \\draw[dashed, red, thick] (O) -- (A);

  % Tiếp tuyến Ax nét liền
  \\draw[thick] (-2.5,2) -- (2.5,2) node[right] {$x$};

  % Kí hiệu góc vuông tại A
  \\draw[red] (0,1.75) -- (0.25,1.75) -- (0.25,2);

  \\fill (O) circle (1.5pt) node[below right] {$O$};
  \\fill (A) circle (1.5pt) node[above] {$A$};
  \\node[right, red] at (0,1) {$R$};
\\end{tikzpicture}`,
    python: `# Python Matplotlib - Đường tròn và tiếp tuyến
import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots(figsize=(4, 4), dpi=300)
circle = plt.Circle((0, 0), 2, color='blue', fill=False, lw=2)
ax.add_patch(circle)
ax.plot([-3, 3], [2, 2], 'k-', lw=2, label='Tiếp tuyến Ax')
ax.plot([0, 0], [0, 2], 'r--', lw=1.5, label='Bán kính OA')
ax.text(0.1, -0.2, 'O', fontweight='bold')
ax.text(0, 2.1, 'A', fontweight='bold')
ax.set_xlim(-3.5, 3.5)
ax.set_ylim(-2.5, 3)
ax.set_aspect('equal')
ax.axis('off')
plt.show()`
  }
];

/**
 * Client-side helper to convert an SVG string to PNG Uint8Array for Word .docx embedding.
 * Runs in browser seamlessly with high-resolution output.
 */
export async function svgToPngBuffer(svgString: string, width = 450, height = 300): Promise<Uint8Array | null> {
  return new Promise((resolve) => {
    try {
      if (typeof window === "undefined" || typeof document === "undefined") {
        return resolve(null);
      }
      const svgClean = (svgString || "").trim();
      if (!svgClean.includes("<svg")) return resolve(null);

      // Ensure proper width, height and namespaces
      let formattedSvg = svgClean;
      if (!formattedSvg.includes('xmlns="http://www.w3.org/2000/svg"')) {
        formattedSvg = formattedSvg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const blob = new Blob([formattedSvg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const scale = 2; // High DPI (2x)
          canvas.width = width * scale;
          canvas.height = height * scale;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            URL.revokeObjectURL(url);
            return resolve(null);
          }

          // Background white
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.scale(scale, scale);
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((pngBlob) => {
            URL.revokeObjectURL(url);
            if (!pngBlob) return resolve(null);
            pngBlob.arrayBuffer().then((ab) => {
              resolve(new Uint8Array(ab));
            }).catch(() => resolve(null));
          }, "image/png");
        } catch {
          URL.revokeObjectURL(url);
          resolve(null);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };

      img.src = url;
    } catch {
      resolve(null);
    }
  });
}
