export interface ShortAnswerQuestion {
  id: number;
  question: string;
  answer: string;
  unit?: string;
  explanation?: string;
  imageUrl?: string;
}

export const MATH_GRADE_6_CK1_STANDARD_TEST = {
  subject: "Toán học",
  grade: "6",
  period: "Cuối học kỳ I",
  time: "90 phút",
  schoolYear: "2026 - 2027",
  schoolName: "TRƯỜNG THCS",
  examFormat: "Tự luận",
  title: "ĐỀ KIỂM TRA CUỐI HỌC KÌ 1 – NĂM HỌC 2026-2027",
  endContent: "Vai trò của đối xứng trong thế giới tự nhiên",
  code: "101",
  objectives: {
    knowledge: [
      "Số học: Số tự nhiên và tập hợp các số tự nhiên. Thứ tự trong tập hợp các số tự nhiên. Các phép tính với số tự nhiên. Phép tính luỹ thừa với số mũ tự nhiên. Tính chia hết trong tập hợp các số tự nhiên. Số nguyên tố. Ước chung và bội chung. Số nguyên âm và tập hợp các số nguyên. Thứ tự trong tập hợp các số nguyên. Các phép tính với số nguyên. Tính chia hết trong tập hợp các số nguyên.",
      "Hình học: Tam giác đều, hình vuông, lục giác đều. Hình chữ nhật, hình thoi, hình bình hành, hình thang cân. Hình có trục đối xứng. Hình có tâm đối xứng. Vai trò của đối xứng trong thế giới tự nhiên."
    ],
    competence: [
      "Nhận biết được tập hợp các số tự nhiên, thứ tự thực hiện các phép tính, quan hệ chia hết, khái niệm ước và bội.",
      "Xác định được ước chung, ước chung lớn nhất; xác định được bội chung, bội chung nhỏ nhất của hai hoặc ba số tự nhiên; thực hiện được phép cộng, phép trừ phân số bằng cách sử dụng ước chung lớn nhất, bội chung nhỏ nhất.",
      "Vận dụng được kiến thức số học vào giải quyết những vấn đề thực tiễn (đơn giản, quen thuộc) (ví dụ: tính toán tiền hay lượng hàng hoá khi mua sắm, xác định số đồ vật cần thiết để sắp xếp chúng theo những quy tắc cho trước,...).",
      "Vận dụng được các tính chất giao hoán, kết hợp, phân phối của phép nhân đối với phép cộng, quy tắc dấu ngoặc trong tập hợp các số nguyên trong tính toán (tính viết và tính nhẩm, tính nhanh một cách hợp lí).",
      "Nhận dạng được tam giác đều, hình vuông, lục giác đều.",
      "Mô tả được một số yếu tố cơ bản (cạnh, góc, đường chéo) của: tam giác đều; hình vuông; lục giác đều.",
      "Giải quyết được một số vấn đề thực tiễn (đơn giản, quen thuộc) gắn với việc tính chu vi và diện tích của các hình đặc biệt nói trên.",
      "Nhận biết được tính đối xứng trong Toán học, tự nhiên, nghệ thuật, kiến trúc, công nghệ chế tạo,..."
    ],
    qualities: [
      "Trung thực: trong học tập và kiểm tra đánh giá.",
      "Trách nhiệm trong học tập và kiểm tra đánh giá.",
      "Chăm chỉ trong quá trình học tập."
    ]
  },
  matrix: [
    {
      topic: "Số tự nhiên",
      content: "Số tự nhiên và tập hợp các số tự nhiên. Thứ tự trong tập hợp các số tự nhiên",
      periods: 3,
      percentage: 2.9,
      halfGroup: "firstHalf",
      mcq_nb: 1, mcq_th: 0, mcq_vd: 0,
      tf_nb: 0, tf_th: 0, tf_vd: 0,
      sa_nb: 0, sa_th: 0, sa_vd: 0,
      tl_nb: 0, tl_th: 0, tl_vd: 0,
      total_nb: 1, total_th: 0, total_vd: 0,
      totalPoints: 0.25
    },
    {
      topic: "Số tự nhiên",
      content: "Các phép tính với số tự nhiên. Phép tính luỹ thừa với số mũ tự nhiên",
      periods: 8,
      percentage: 7.7,
      halfGroup: "firstHalf",
      mcq_nb: 1, mcq_th: 0, mcq_vd: 0,
      tf_nb: 0, tf_th: 0, tf_vd: 0,
      sa_nb: 1, sa_th: 0, sa_vd: 0,
      tl_nb: 0, tl_th: 0, tl_vd: 0,
      total_nb: 2, total_th: 0, total_vd: 0,
      totalPoints: 0.75
    },
    {
      topic: "Số tự nhiên",
      content: "Tính chia hết trong tập hợp các số tự nhiên. Số nguyên tố. Ước chung và bội chung",
      periods: 15,
      percentage: 14.5,
      halfGroup: "firstHalf",
      mcq_nb: 0, mcq_th: 0, mcq_vd: 0,
      tf_nb: 2, tf_th: 1, tf_vd: 1,
      sa_nb: 0, sa_th: 0, sa_vd: 1,
      tl_nb: 0, tl_th: 0, tl_vd: 0,
      total_nb: 2, total_th: 1, total_vd: 2,
      totalPoints: 1.50
    },
    {
      topic: "Số nguyên",
      content: "Số nguyên âm và tập hợp các số nguyên. Thứ tự trong tập hợp các số nguyên",
      periods: 2,
      percentage: 1.9,
      halfGroup: "firstHalf",
      mcq_nb: 1, mcq_th: 0, mcq_vd: 0,
      tf_nb: 0, tf_th: 0, tf_vd: 0,
      sa_nb: 0, sa_th: 0, sa_vd: 0,
      tl_nb: 0, tl_th: 0, tl_vd: 0,
      total_nb: 1, total_th: 0, total_vd: 0,
      totalPoints: 0.25
    },
    {
      topic: "Số nguyên",
      content: "Các phép tính với số nguyên. Tính chia hết trong tập hợp các số nguyên",
      periods: 3,
      percentage: 2.9,
      halfGroup: "firstHalf",
      mcq_nb: 1, mcq_th: 0, mcq_vd: 0,
      tf_nb: 0, tf_th: 0, tf_vd: 0,
      sa_nb: 0, sa_th: 0, sa_vd: 0,
      tl_nb: 0, tl_th: 0, tl_vd: 0,
      total_nb: 1, total_th: 0, total_vd: 0,
      totalPoints: 0.25
    },
    {
      topic: "Số nguyên",
      content: "Các phép tính với số nguyên. Tính chia hết trong tập hợp các số nguyên",
      periods: 6,
      percentage: 19.1,
      halfGroup: "secondHalf",
      mcq_nb: 0, mcq_th: 0, mcq_vd: 0,
      tf_nb: 0, tf_th: 0, tf_vd: 0,
      sa_nb: 0, sa_th: 0, sa_vd: 0,
      tl_nb: 0, tl_th: 1, tl_vd: 1,
      total_nb: 0, total_th: 1, total_vd: 1,
      totalPoints: 2.00
    },
    {
      topic: "Các hình phẳng trong thực tiễn",
      content: "Tam giác đều, hình vuông, lục giác đều",
      periods: 4,
      percentage: 12.7,
      halfGroup: "secondHalf",
      mcq_nb: 2, mcq_th: 0, mcq_vd: 0,
      tf_nb: 0, tf_th: 0, tf_vd: 0,
      sa_nb: 0, sa_th: 2, sa_vd: 0,
      tl_nb: 0, tl_th: 0, tl_vd: 0,
      total_nb: 2, total_th: 2, total_vd: 0,
      totalPoints: 1.50
    },
    {
      topic: "Các hình phẳng trong thực tiễn",
      content: "Hình chữ nhật, hình thoi, hình bình hành, hình thang cân",
      periods: 7,
      percentage: 22.3,
      halfGroup: "secondHalf",
      mcq_nb: 1, mcq_th: 0, mcq_vd: 0,
      tf_nb: 2, tf_th: 1, tf_vd: 1,
      sa_nb: 0, sa_th: 0, sa_vd: 0,
      tl_nb: 0, tl_th: 0, tl_vd: 1,
      total_nb: 3, total_th: 1, total_vd: 2,
      totalPoints: 2.25
    },
    {
      topic: "Tính đối xứng của hình phẳng trong thế giới tự nhiên",
      content: "Hình có trục đối xứng",
      periods: 2,
      percentage: 6.4,
      halfGroup: "secondHalf",
      mcq_nb: 2, mcq_th: 0, mcq_vd: 0,
      tf_nb: 0, tf_th: 0, tf_vd: 0,
      sa_nb: 0, sa_th: 0, sa_vd: 0,
      tl_nb: 0, tl_th: 0, tl_vd: 0,
      total_nb: 2, total_th: 0, total_vd: 0,
      totalPoints: 0.50
    },
    {
      topic: "Tính đối xứng của hình phẳng trong thế giới tự nhiên",
      content: "Hình có tâm đối xứng",
      periods: 2,
      percentage: 6.4,
      halfGroup: "secondHalf",
      mcq_nb: 2, mcq_th: 0, mcq_vd: 0,
      tf_nb: 0, tf_th: 0, tf_vd: 0,
      sa_nb: 0, sa_th: 0, sa_vd: 0,
      tl_nb: 0, tl_th: 0, tl_vd: 0,
      total_nb: 2, total_th: 0, total_vd: 0,
      totalPoints: 0.50
    },
    {
      topic: "Tính đối xứng của hình phẳng trong thế giới tự nhiên",
      content: "Vai trò của đối xứng trong thế giới tự nhiên",
      periods: 1,
      percentage: 3.2,
      halfGroup: "secondHalf",
      mcq_nb: 1, mcq_th: 0, mcq_vd: 0,
      tf_nb: 0, tf_th: 0, tf_vd: 0,
      sa_nb: 0, sa_th: 0, sa_vd: 0,
      tl_nb: 0, tl_th: 0, tl_vd: 0,
      total_nb: 1, total_th: 0, total_vd: 0,
      totalPoints: 0.25
    }
  ],
  specification: [
    {
      topic: "Số tự nhiên",
      content: "Số tự nhiên và tập hợp các số tự nhiên. Thứ tự trong tập hợp các số tự nhiên",
      nb_desc: "– Nhận biết được tập hợp các số tự nhiên.",
      th_desc: "– Biểu diễn được số tự nhiên trong hệ thập phân.\n– Biểu diễn được các số tự nhiên từ 1 đến 30 bằng cách sử dụng các chữ số La Mã.",
      vd_desc: "– Sử dụng được thuật ngữ tập hợp, phần tử thuộc (không thuộc) một tập hợp; sử dụng được cách cho tập hợp.",
      mcq_nb_code: "1 (C1)",
      nb_count: 1,
      th_count: 0,
      vd_count: 0
    },
    {
      topic: "Số tự nhiên",
      content: "Các phép tính với số tự nhiên. Phép tính luỹ thừa với số mũ tự nhiên",
      nb_desc: "– Nhận biết được thứ tự thực hiện các phép tính.",
      th_desc: "",
      vd_desc: "– Thực hiện được các phép tính: cộng, trừ, nhân, chia trong tập hợp số tự nhiên.\n– Vận dụng được các tính chất giao hoán, kết hợp, phân phối của phép nhân đối với phép cộng trong tính toán.\n– Thực hiện được phép tính luỹ thừa với số mũ tự nhiên; thực hiện được các phép nhân và phép chia hai luỹ thừa cùng cơ số với số mũ tự nhiên.\n– Vận dụng được các tính chất của phép tính (kể cả phép tính luỹ thừa với số mũ tự nhiên) để tính nhẩm, tính nhanh một cách hợp lí.\n– Giải quyết được những vấn đề thực tiễn (đơn giản, quen thuộc) gắn với thực hiện các phép tính.",
      mcq_nb_code: "1 (C2)",
      sa_nb_code: "1 (C15)",
      nb_count: 2,
      th_count: 0,
      vd_count: 0
    },
    {
      topic: "Số tự nhiên",
      content: "Tính chia hết trong tập hợp các số tự nhiên. Số nguyên tố. Ước chung và bội chung",
      nb_desc: "– Nhận biết được quan hệ chia hết, khái niệm ước và bội.\n– Nhận biết được khái niệm số nguyên tố, hợp số.\n– Nhận biết được phép chia có dư, định lí về phép chia có dư.\n– Nhận biết được phân số tối giản.",
      th_desc: "– Tìm được ước và bội của một số tự nhiên.",
      vd_desc: "– Vận dụng được dấu hiệu chia hết cho 2, 5, 9, 3 để xác định một số đã cho có chia hết cho 2, 5, 9, 3 hay không.\n– Thực hiện được việc phân tích một số tự nhiên lớn hơn 1 thành tích của các thừa số nguyên tố trong những trường hợp đơn giản.\n– Xác định được ước chung, ước chung lớn nhất; xác định được bội chung, bội chung nhỏ nhất của hai hoặc ba số tự nhiên; thực hiện được phép cộng, phép trừ phân số bằng cách sử dụng ước chung lớn nhất, bội chung nhỏ nhất.\n– Vận dụng được kiến thức số học vào giải quyết những vấn đề thực tiễn.",
      tf_nb_code: "1/2 (C13a,b)",
      tf_th_code: "1/4 (C13c)",
      tf_vd_code: "1/4 (C13d)",
      sa_vd_code: "1 (C16)",
      nb_count: 2,
      th_count: 1,
      vd_count: 2
    },
    {
      topic: "Số nguyên",
      content: "Số nguyên âm và tập hợp các số nguyên. Thứ tự trong tập hợp các số nguyên",
      nb_desc: "– Nhận biết được số nguyên âm, tập hợp các số nguyên.\n– Nhận biết được số đối của một số nguyên.\n– Nhận biết được thứ tự trong tập hợp các số nguyên.\n– Nhận biết được ý nghĩa của số nguyên âm trong một số bài toán thực tiễn.",
      th_desc: "– Biểu diễn được số nguyên trên trục số.\n– So sánh được hai số nguyên cho trước.",
      vd_desc: "",
      mcq_nb_code: "1 (C3)",
      nb_count: 1,
      th_count: 0,
      vd_count: 0
    },
    {
      topic: "Số nguyên",
      content: "Các phép tính với số nguyên. Tính chia hết trong tập hợp các số nguyên (nửa đầu kỳ)",
      nb_desc: "– Nhận biết được quan hệ chia hết, khái niệm ước và bội trong tập hợp các số nguyên.",
      th_desc: "– Thực hiện được các phép tính: cộng, trừ, nhân, chia (chia hết) trong tập hợp các số nguyên.",
      vd_desc: "– Vận dụng được các tính chất giao hoán, kết hợp, phân phối của phép nhân đối với phép cộng, quy tắc dấu ngoặc trong tập hợp các số nguyên trong tính toán.\n– Giải quyết được những vấn đề thực tiễn gắn với thực hiện các phép tính về số nguyên.",
      mcq_nb_code: "1 (C4)",
      nb_count: 1,
      th_count: 0,
      vd_count: 0
    },
    {
      topic: "Số nguyên",
      content: "Các phép tính với số nguyên. Tính chia hết trong tập hợp các số nguyên (nửa sau kỳ)",
      nb_desc: "",
      th_desc: "– Thực hiện được các phép tính: cộng, trừ, nhân, chia (chia hết) trong tập hợp các số nguyên.",
      vd_desc: "– Vận dụng các phép tính và quy tắc dấu ngoặc, tính chất giao hoán, phân phối để thực hiện phép tính và tìm x.",
      tl_th_code: "1 (C19)",
      tl_vd_code: "1 (C20)",
      nb_count: 0,
      th_count: 1,
      vd_count: 1
    },
    {
      topic: "Các hình phẳng trong thực tiễn",
      content: "Tam giác đều, hình vuông, lục giác đều",
      nb_desc: "– Nhận dạng được tam giác đều, hình vuông, lục giác đều.",
      th_desc: "– Mô tả được một số yếu tố cơ bản (cạnh, góc, đường chéo) của: tam giác đều, hình vuông, lục giác đều.",
      vd_desc: "– Vẽ được tam giác đều, hình vuông bằng dụng cụ học tập.\n– Tạo lập được lục giác đều thông qua việc lắp ghép các tam giác đều.",
      mcq_nb_code: "2 (C5,6)",
      sa_th_code: "2 (C17,18)",
      nb_count: 2,
      th_count: 2,
      vd_count: 0
    },
    {
      topic: "Các hình phẳng trong thực tiễn",
      content: "Hình chữ nhật, hình thoi, hình bình hành, hình thang cân",
      nb_desc: "– Mô tả được một số yếu tố cơ bản (cạnh, góc, đường chéo) của hình chữ nhật, hình thoi, hình bình hành, hình thang cân.",
      th_desc: "– Vẽ được hình chữ nhật, hình thoi, hình bình hành bằng các dụng cụ học tập.\n– Giải quyết được một số vấn đề thực tiễn gắn với việc tính chu vi và diện tích của các hình đặc biệt.",
      vd_desc: "– Giải quyết được một số vấn đề thực tiễn gắn với việc tính chu vi và diện tích của các hình đặc biệt nói trên.",
      mcq_nb_code: "1 (C7)",
      tf_nb_code: "1/2 (C14a,b)",
      tf_th_code: "1/4 (C14c)",
      tf_vd_code: "1/4 (C14d)",
      tl_vd_code: "1 (C21)",
      nb_count: 3,
      th_count: 1,
      vd_count: 2
    },
    {
      topic: "Tính đối xứng của hình phẳng trong thế giới tự nhiên",
      content: "Hình có trục đối xứng",
      nb_desc: "– Nhận biết được trục đối xứng của một hình phẳng.\n– Nhận biết được những hình phẳng trong tự nhiên có trục đối xứng (khi quan sát trên hình ảnh 2 chiều).",
      th_desc: "",
      vd_desc: "",
      mcq_nb_code: "2 (C8,9)",
      nb_count: 2,
      th_count: 0,
      vd_count: 0
    },
    {
      topic: "Tính đối xứng của hình phẳng trong thế giới tự nhiên",
      content: "Hình có tâm đối xứng",
      nb_desc: "– Nhận biết được tâm đối xứng của một hình phẳng.\n– Nhận biết được những hình phẳng trong thế giới tự nhiên có tâm đối xứng (khi quan sát trên hình ảnh 2 chiều).",
      th_desc: "",
      vd_desc: "",
      mcq_nb_code: "2 (C10,11)",
      nb_count: 2,
      th_count: 0,
      vd_count: 0
    },
    {
      topic: "Tính đối xứng của hình phẳng trong thế giới tự nhiên",
      content: "Vai trò của đối xứng trong thế giới tự nhiên",
      nb_desc: "– Nhận biết được tính đối xứng trong Toán học, tự nhiên, nghệ thuật, kiến trúc, công nghệ chế tạo,...\n– Nhận biết được vẻ đẹp của thế giới tự nhiên biểu hiện qua tính đối xứng.",
      th_desc: "",
      vd_desc: "",
      mcq_nb_code: "1 (C12)",
      nb_count: 1,
      th_count: 0,
      vd_count: 0
    }
  ],
  mcq: [
    {
      id: 1,
      question: "Cho tập hợp $A = \\{x \\in \\mathbb{N} \\mid 4 < x \\le 9\\}$. Tập hợp A được viết dưới dạng liệt kê là",
      options: [
        "A. $A = \\{4; 5; 6; 7; 8; 9\\}$",
        "B. $A = \\{4; 5; 6; 7; 8\\}$",
        "C. $A = \\{5; 6; 7; 8\\}$",
        "D. $A = \\{5; 6; 7; 8; 9\\}$"
      ],
      correctAnswer: "D",
      explanation: "Vì $x \\in \\mathbb{N}$ và $4 < x \\le 9$ nên $x \\in \\{5; 6; 7; 8; 9\\}$."
    },
    {
      id: 2,
      question: "Đối với biểu thức có dấu ngoặc, thứ tự thực hiện phép tính đúng là",
      options: [
        "A. $[\\;] \\to (\\;) \\to \\{\\;\\}$",
        "B. $(\\;) \\to [\\;] \\to \\{\\;\\}$",
        "C. \\{\\;\\} \\to [\\;] \\to (\\;)",
        "D. $[\\;] \\to \\{\\;\\} \\to (\\;)"
      ],
      correctAnswer: "B",
      explanation: "Thứ tự thực hiện phép tính trong biểu thức có dấu ngoặc là ngoặc tròn $(\\;)$ trước, rồi đến ngoặc vuông $[\\;]$, cuối cùng là ngoặc nhọn $\\{\\;\\}$."
    },
    {
      id: 3,
      question: "Có bao nhiêu số nguyên âm trong các số sau: $-15; 0; -21; -5\\frac{1}{2}; -26; 12; -37$?",
      options: [
        "A. 2",
        "B. 3",
        "C. 4",
        "D. 5"
      ],
      correctAnswer: "C",
      explanation: "Các số nguyên âm gồm: $-15, -21, -26, -37$ (4 số). Lưu ý $-5\\frac{1}{2}$ là số hữu tỉ không phải số nguyên, 0 không phải số nguyên âm."
    },
    {
      id: 4,
      question: "Trong các số 12, 26, 32, 48 số nào không là bội của 4?",
      options: [
        "A. 26",
        "B. 48",
        "C. 12",
        "D. 32"
      ],
      correctAnswer: "A",
      explanation: "Vì 26 không chia hết cho 4 ($26 = 4 \\times 6 + 2$) nên 26 không là bội của 4."
    },
    {
      id: 5,
      question: "Trong các hình dạng phổ biến trong tự nhiên và đời sống (tổ ong, viên gạch lục giác, hộp bánh mứt 6 cạnh đều), có bao nhiêu hình là hình lục giác đều?",
      options: [
        "A. 1",
        "B. 2",
        "C. 3",
        "D. 4"
      ],
      correctAnswer: "C",
      explanation: "Cả 3 hình ảnh minh họa tổ ong, viên gạch lát nền và hộp mứt lục giác đều có 6 cạnh bằng nhau và 6 góc bằng nhau."
    },
    {
      id: 6,
      question: "Trong các hình tam giác có kích thước đã cho, hình nào là tam giác đều?",
      options: [
        "A. Hình (1) có 3 cạnh lần lượt là 3cm, 4cm, 5cm",
        "B. Hình (2) có 2 cạnh bằng 4cm và 1 cạnh 5cm",
        "C. Hình (3) có 3 cạnh đều bằng nhau (3cm, 3cm, 3cm)",
        "D. Hình (4) có 1 góc vuông"
      ],
      correctAnswer: "C",
      explanation: "Tam giác đều là tam giác có 3 cạnh bằng nhau và 3 góc bằng nhau ($60^\\circ$)."
    },
    {
      id: 7,
      question: "Cho hình thang cân $ABCD$ có $BC = 4\\text{ cm}$. Khẳng định nào sau đây là đúng?",
      options: [
        "A. $AD = 4\\text{ cm}$",
        "B. $AB = 4\\text{ cm}$",
        "C. $AC = 4\\text{ cm}$",
        "D. $CD = 4\\text{ cm}$"
      ],
      correctAnswer: "A",
      explanation: "Hình thang cân có hai cạnh bên bằng nhau, do đó $AD = BC = 4\\text{ cm}$."
    },
    {
      id: 8,
      question: "Trong các biển báo giao thông quen thuộc, hình nào KHÔNG có trục đối xứng?",
      options: [
        "A. Biển báo cấm rẽ trái (có mũi tên uốn cong)",
        "B. Biển báo hình chữ thập đỏ cứu thương",
        "C. Biển báo nguy hiểm tam giác đều cảnh báo giao nhau",
        "D. Biển báo tam giác đều viền đỏ nền vàng"
      ],
      correctAnswer: "A",
      explanation: "Biển báo cấm rẽ có mũi tên cong không thể gấp lại thành hai nửa trùng khít nên không có trục đối xứng."
    },
    {
      id: 9,
      question: "Trong các chữ cái in hoa dưới đây, chữ cái có trục đối xứng là",
      options: [
        "A. Chữ Q",
        "B. Chữ P",
        "C. Chữ E",
        "D. Chữ N"
      ],
      correctAnswer: "C",
      explanation: "Chữ E in hoa có trục đối xứng nằm ngang."
    },
    {
      id: 10,
      question: "Trong các hình dưới đây, hình có tâm đối xứng là",
      options: [
        "A. Hình đám mây bất đối xứng",
        "B. Hình mũi tên một chiều",
        "C. Hình trăng khuyết",
        "D. Hình mặt trời có 8 tia tỏa đều đối xứng qua tâm"
      ],
      correctAnswer: "D",
      explanation: "Hình 4 khi quay nửa vòng ($180^\\circ$) quanh tâm sẽ trùng khít với chính nó nên có tâm đối xứng."
    },
    {
      id: 11,
      question: "Hình nào sau đây KHÔNG có tâm đối xứng?",
      options: [
        "A. Hình tam giác đều",
        "B. Hình thoi",
        "C. Hình chữ nhật",
        "D. Hình bình hành"
      ],
      correctAnswer: "A",
      explanation: "Tam giác đều chỉ có 3 trục đối xứng, không có tâm đối xứng."
    },
    {
      id: 12,
      question: "Chọn khẳng định đúng về hoa Lưu Ly (hoa có 5 cánh tỏa đều đối xứng):",
      options: [
        "A. Hoa Lưu Ly có tâm đối xứng.",
        "B. Hoa Lưu Ly có trục đối xứng.",
        "C. Hoa Lưu Ly có tâm đối xứng và có trục đối xứng.",
        "D. Hoa Lưu Ly không có tâm đối xứng và không có trục đối xứng."
      ],
      correctAnswer: "B",
      explanation: "Hoa có 5 cánh (số lẻ) có các trục đối xứng đi qua từng đỉnh cánh hoa, nhưng không có tâm đối xứng."
    }
  ],
  tf: [
    {
      id: 13,
      question: "Cho tập hợp A các số x sao cho $30 \\vdots x$ và $x \\le 10$, và tập hợp B các số y sao cho $18 \\vdots y$ và $y > 3$.",
      statements: [
        { id: "a", text: "Các số x là bội của số 30.", isTrue: false },
        { id: "b", text: "$A = \\{1; 2; 3; 5; 6; 10\\}$.", isTrue: true },
        { id: "c", text: "$B = \\{3; 6; 9; 18\\}$.", isTrue: false },
        { id: "d", text: "6 là ước chung của 30 và 18.", isTrue: true }
      ]
    },
    {
      id: 14,
      question: "Cho hình thoi $ABCD$ có độ dài cạnh $AB = 5\\text{ cm}$. Xét tính đúng sai của các khẳng định sau:",
      statements: [
        { id: "a", text: "$AC = 5\\text{ cm}$.", isTrue: false },
        { id: "b", text: "$CD = 5\\text{ cm}$.", isTrue: true },
        { id: "c", text: "Chu vi của hình thoi là $20\\text{ cm}$.", isTrue: true },
        { id: "d", text: "Chu vi của hình thoi là $25\\text{ cm}$.", isTrue: false }
      ]
    }
  ],
  shortAnswer: [
    {
      id: 15,
      question: "Tính giá trị của biểu thức $9 - 9 : 3 \\cdot 2$.",
      answer: "3",
      unit: "",
      explanation: "Thực hiện phép chia và nhân trước từ trái sang phải: $9 : 3 = 3$, $3 \\cdot 2 = 6$, sau đó lấy $9 - 6 = 3$."
    },
    {
      id: 16,
      question: "Tìm số tự nhiên $a$ nhỏ nhất khác 0 biết rằng $a \\vdots 28$ và $a \\vdots 32$.",
      answer: "224",
      unit: "",
      explanation: "$a = \\text{BCNN}(28, 32)$. Ta có $28 = 2^2 \\cdot 7$; $32 = 2^5$. Do đó $\\text{BCNN}(28, 32) = 2^5 \\cdot 7 = 32 \\cdot 7 = 224$."
    },
    {
      id: 17,
      question: "Cho tam giác $MNP$ đều có $NP = 3\\text{ cm}$. Tính độ dài cạnh $MN$.",
      answer: "3",
      unit: "cm",
      explanation: "Vì tam giác $MNP$ đều nên ba cạnh bằng nhau: $MN = NP = MP = 3\\text{ cm}$."
    },
    {
      id: 18,
      question: "Cho hình vuông $ABCD$ có đường chéo $AC = 16\\text{ cm}$. Tính độ dài đường chéo $BD$.",
      answer: "16",
      unit: "cm",
      explanation: "Hình vuông có hai đường chéo bằng nhau, do đó $BD = AC = 16\\text{ cm}$."
    }
  ],
  applied: [
    {
      id: 19,
      question: "a) Thực hiện phép tính: $20 - [30 - (5 - 1)^2]$\nb) Tìm x, biết: $3x - 9 = 27$.",
      answer: "a) $20 - [30 - (5 - 1)^2] = 20 - [30 - 4^2] = 20 - [30 - 16] = 20 - 14 = 6$.\nb) $3x - 9 = 27 \\implies 3x = 27 + 9 = 36 \\implies x = 36 : 3 = 12$. Vậy $x = 12$.",
      pointsBreakdown: [
        { criteria: "Ý a: Tính đúng trong ngoặc $(5-1)^2 = 16$ và ra kết quả 6", points: "0.5" },
        { criteria: "Ý b: Chuyển vế $3x = 36$ và tìm được $x = 12$", points: "0.5" }
      ]
    },
    {
      id: 20,
      question: "a) Thực hiện phép tính: $3 \\cdot 4^2 + 12 : 2024^0 - 72 : 2^3$\nb) Tính bằng cách hợp lý: $43 \\cdot 89 + 11 \\cdot 43 - 300$.",
      answer: "a) $3 \\cdot 16 + 12 : 1 - 72 : 8 = 48 + 12 - 9 = 60 - 9 = 51$.\nb) $43 \\cdot (89 + 11) - 300 = 43 \\cdot 100 - 300 = 4300 - 300 = 4000$.",
      pointsBreakdown: [
        { criteria: "Ý a: Tính đúng lũy thừa và thứ tự phép tính ra 51", points: "0.5" },
        { criteria: "Ý b: Áp dụng tính chất phân phối $43 \\cdot (89 + 11) - 300$ ra 4000", points: "0.5" }
      ]
    },
    {
      id: 21,
      question: "Một mảnh vườn hình vuông có chiều dài cạnh là $20\\text{ m}$. Người ta làm hai lối đi rộng $5\\text{ m}$ cắt nhau vuông góc qua tâm như trên hình vẽ.\na) Tính chu vi mảnh vườn.\nb) Tính số tiền phải trả để lót gạch hai lối đi biết rằng chi phí lót gạch mỗi mét vuông lối đi là 110 000 đồng.",
      answer: "a) Chu vi mảnh vườn là: $20 \\cdot 4 = 80\\text{ (m)}$.\nb) Diện tích hai lối đi là: $5 \\cdot 20 + 5 \\cdot 20 - 5 \\cdot 5 = 100 + 100 - 25 = 175\\text{ (m}^2\\text{)}$.\nChi phí lót gạch là: $175 \\times 110\\,000 = 19\\,250\\,000\\text{ (đồng)}$.",
      pointsBreakdown: [
        { criteria: "Ý a: Tính đúng chu vi mảnh vườn = 80 m", points: "0.5" },
        { criteria: "Ý b: Tính đúng diện tích lối đi = 175 m² và chi phí = 19 250 000 đồng", points: "0.5" }
      ]
    }
  ]
};
