import { TextbookGrade } from "../textbooks";

export const MATH_TEXTBOOK_GRADE_9: TextbookGrade = {
  grade: "9",
  bookSeries: "Kết nối tri thức với cuộc sống",
  title: "Toán học 9 - Bộ sách Kết nối tri thức với cuộc sống",
  description: "Chuẩn kiến thức, kĩ năng theo Chương trình GDPT 2018 môn Toán lớp 9 (Tập 1 & Tập 2)",
  topics: [
    {
      id: "math9_c1",
      name: "Chương I. Phương trình và hệ hai phương trình bậc nhất hai ẩn",
      lessons: [
        {
          id: "m9_b1",
          lessonNumber: "Bài 1",
          name: "Bài 1. Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn",
          topicId: "math9_c1",
          topicName: "Chương I. Phương trình và hệ hai phương trình bậc nhất hai ẩn",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Định nghĩa phương trình bậc nhất hai ẩn ax + by = c (a, b không đồng thời bằng 0).",
              "Khái niệm nghiệm và tập nghiệm của phương trình bậc nhất hai ẩn.",
              "Định nghĩa hệ hai phương trình bậc nhất hai ẩn và nghiệm của hệ."
            ],
            understanding: [
              "Biểu diễn hình học tập nghiệm của phương trình bậc nhất hai ẩn trên mặt phẳng tọa độ Oxy (đường thẳng ax + by = c).",
              "Kiểm tra xem một cặp số (x0; y0) có phải là nghiệm của phương trình hoặc hệ phương trình hay không."
            ],
            application: [
              "Mô tả mối quan hệ giữa hai đại lượng thực tế bằng phương trình và hệ phương trình bậc nhất hai ẩn."
            ]
          },
          keyConcepts: ["Phương trình bậc nhất hai ẩn", "Hệ hai phương trình bậc nhất hai ẩn", "Nghiệm (x0; y0)", "Đường thẳng biểu diễn tập nghiệm"]
        },
        {
          id: "m9_b2",
          lessonNumber: "Bài 2",
          name: "Bài 2. Giải hệ hai phương trình bậc nhất hai ẩn",
          topicId: "math9_c1",
          topicName: "Chương I. Phương trình và hệ hai phương trình bậc nhất hai ẩn",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nắm vững hai phương pháp giải hệ cơ bản: Phương pháp thế và Phương pháp cộng đại số."
            ],
            understanding: [
              "Giải thành thạo hệ hai phương trình bậc nhất hai ẩn bằng phương pháp thế và phương pháp cộng đại số.",
              "Sử dụng máy tính cầm tay để tìm và kiểm tra nghiệm của hệ phương trình."
            ],
            application: [
              "Tìm hệ số a, b của đường thẳng y = ax + b đi qua hai điểm phân biệt."
            ]
          },
          keyConcepts: ["Phương pháp thế", "Phương pháp cộng đại số", "Nghiệm duy nhất", "Vô nghiệm", "Vô số nghiệm", "Máy tính cầm tay"]
        },
        {
          id: "m9_b3",
          lessonNumber: "Bài 3",
          name: "Bài 3. Giải bài toán bằng cách lập hệ phương trình",
          topicId: "math9_c1",
          topicName: "Chương I. Phương trình và hệ hai phương trình bậc nhất hai ẩn",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nắm vững các bước giải bài toán bằng cách lập hệ hai phương trình bậc nhất hai ẩn."
            ],
            understanding: [
              "Phân tích mối quan hệ giữa hai đại lượng chưa biết và thiết lập hệ phương trình gồm hai phương trình độc lập."
            ],
            application: [
              "Giải các bài toán thực tế: toán chuyển động xuôi/ngược dòng, toán làm chung/làm riêng, toán tìm số, toán phần trăm nồng độ hóa chất, bài toán kinh tế tài chính."
            ]
          },
          keyConcepts: ["Giải bài toán bằng cách lập hệ phương trình", "Chọn ẩn và điều kiện", "Toán chuyển động", "Toán làm chung - làm riêng", "Toán phần trăm"]
        }
      ]
    },
    {
      id: "math9_c2",
      name: "Chương II. Phương trình và bất phương trình bậc nhất một ẩn",
      lessons: [
        {
          id: "m9_b4",
          lessonNumber: "Bài 4",
          name: "Bài 4. Phương trình quy về phương trình bậc nhất một ẩn",
          topicId: "math9_c2",
          topicName: "Chương II. Phương trình và bất phương trình bậc nhất một ẩn",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết phương trình tích có dạng (ax + b)(cx + d) = 0.",
              "Nhận biết phương trình chứa ẩn ở mẫu và điều kiện xác định (ĐKXĐ)."
            ],
            understanding: [
              "Giải thành thạo phương trình tích (ax + b = 0 hoặc cx + d = 0).",
              "Giải phương trình chứa ẩn ở mẫu (tìm ĐKXĐ, quy đồng, khử mẫu, giải và đối chiếu ĐKXĐ)."
            ],
            application: [
              "Giải bài toán chuyển động, năng suất quy về phương trình chứa ẩn ở mẫu."
            ]
          },
          keyConcepts: ["Phương trình tích", "Phương trình chứa ẩn ở mẫu", "Điều kiện xác định ĐKXĐ", "Khử mẫu", "Nghiệm ngoại lai"]
        },
        {
          id: "m9_b5",
          lessonNumber: "Bài 5",
          name: "Bài 5. Bất đẳng thức và tính chất",
          topicId: "math9_c2",
          topicName: "Chương II. Phương trình và bất phương trình bậc nhất một ẩn",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Khái niệm bất đẳng thức (a > b, a < b, a ≥ b, a ≤ b), vế trái, vế phải.",
              "Tính chất bắc cầu: a < b và b < c thì a < c.",
              "Liên hệ giữa thứ tự và phép cộng: a < b thì a + c < b + c.",
              "Liên hệ giữa thứ tự và phép nhân: a < b và c > 0 thì ac < bc; a < b và c < 0 thì ac > bc (đổi chiều bất đẳng thức)."
            ],
            understanding: [
              "Chứng minh bất đẳng thức đơn giản dựa vào định nghĩa (xét hiệu A - B) và tính chất.",
              "Bất đẳng thức Cauchy (AM-GM) cho hai số không âm: (a+b)/2 ≥ √(ab)."
            ],
            application: [
              "So sánh các đại lượng thực tế, ước lượng chi phí du lịch."
            ]
          },
          keyConcepts: ["Bất đẳng thức", "Tính chất bắc cầu", "Cộng cùng một số", "Nhân với số dương/số âm", "Bất đẳng thức AM-GM"]
        },
        {
          id: "m9_b6",
          lessonNumber: "Bài 6",
          name: "Bài 6. Bất phương trình bậc nhất một ẩn",
          topicId: "math9_c2",
          topicName: "Chương II. Phương trình và bất phương trình bậc nhất một ẩn",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Định nghĩa bất phương trình bậc nhất một ẩn ax + b < 0 (hoặc > 0, ≤ 0, ≥ 0 với a ≠ 0).",
              "Khái niệm nghiệm và tập nghiệm của bất phương trình."
            ],
            understanding: [
              "Giải thành thạo bất phương trình bậc nhất một ẩn bằng quy tắc chuyển vế và nhân với một số (chú ý đổi chiều khi nhân/chia số âm).",
              "Biểu diễn tập nghiệm trên trục số."
            ],
            application: [
              "Giải các bài toán thực tế: tìm số lượng sản phẩm tối thiểu, cước taxi, trọng tải thang máy."
            ]
          },
          keyConcepts: ["Bất phương trình bậc nhất một ẩn", "Tập nghiệm", "Biểu diễn trên trục số", "Đổi chiều bất phương trình"]
        }
      ]
    },
    {
      id: "math9_c3",
      name: "Chương III. Căn bậc hai và căn bậc ba",
      lessons: [
        {
          id: "m9_b7",
          lessonNumber: "Bài 7",
          name: "Bài 7. Căn bậc hai và căn thức bậc hai",
          topicId: "math9_c3",
          topicName: "Chương III. Căn bậc hai và căn bậc ba",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Định nghĩa căn bậc hai của số thực không âm a (gồm √a và -√a).",
              "Khái niệm căn thức bậc hai √A và điều kiện xác định A ≥ 0.",
              "Hằng đẳng thức √(A^2) = |A|."
            ],
            understanding: [
              "Tìm điều kiện xác định của biểu thức chứa căn thức bậc hai.",
              "Vận dụng hằng đẳng thức √(A^2) = |A| để rút gọn biểu thức chứa căn số và căn biến."
            ],
            application: [
              "Tính thời gian rơi tự do t = √(2h/g), bán kính đường tròn khi biết diện tích."
            ]
          },
          keyConcepts: ["Căn bậc hai", "Căn thức bậc hai √A", "Điều kiện A ≥ 0", "√(A^2) = |A|"]
        },
        {
          id: "m9_b8",
          lessonNumber: "Bài 8",
          name: "Bài 8. Khai căn bậc hai với phép nhân và phép chia",
          topicId: "math9_c3",
          topicName: "Chương III. Căn bậc hai và căn bậc ba",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Quy tắc khai phương một tích: √(A.B) = √A . √B (với A ≥ 0, B ≥ 0).",
              "Quy tắc khai phương một thương: √(A/B) = √A / √B (với A ≥ 0, B > 0)."
            ],
            understanding: [
              "Thực hiện thành thạo phép nhân và chia các căn thức bậc hai.",
              "Rút gọn các biểu thức chứa căn bậc hai."
            ],
            application: [
              "Tính toán công suất dòng điện P = U^2/R, hiệu điện thế U = √(P.R)."
            ]
          },
          keyConcepts: ["Khai phương một tích", "Nhân các căn thức bậc hai", "Khai phương một thương", "Chia các căn thức bậc hai"]
        },
        {
          id: "m9_b9",
          lessonNumber: "Bài 9",
          name: "Bài 9. Biến đổi đơn giản và rút gọn biểu thức chứa căn thức bậc hai",
          topicId: "math9_c3",
          topicName: "Chương III. Căn bậc hai và căn bậc ba",
          periods: 4,
          learningOutcomes: {
            recognition: [
              "Phép đưa thừa số ra ngoài dấu căn: √(A^2.B) = |A|√B.",
              "Phép đưa thừa số vào trong dấu căn: A√B = √(A^2.B) (A ≥ 0) hoặc -√(A^2.B) (A < 0).",
              "Phép khử mẫu của biểu thức lấy căn và Trục căn thức ở mẫu (dùng lượng liên hợp)."
            ],
            understanding: [
              "Rút gọn biểu thức chứa căn thức bậc hai tổng hợp.",
              "Tìm giá trị của x để biểu thức rút gọn nhận giá trị nguyên hoặc thỏa mãn bất đẳng thức."
            ],
            application: [
              "Tính toán độ co giãn thời gian theo thuyết tương đối của Einstein."
            ]
          },
          keyConcepts: ["Đưa thừa số ra ngoài/vào trong dấu căn", "Khử mẫu biểu thức lấy căn", "Trục căn thức ở mẫu", "Lượng liên hợp"]
        },
        {
          id: "m9_b10",
          lessonNumber: "Bài 10",
          name: "Bài 10. Căn bậc ba và căn thức bậc ba",
          topicId: "math9_c3",
          topicName: "Chương III. Căn bậc hai và căn bậc ba",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Định nghĩa căn bậc ba của một số thực a bất kì (kí hiệu ³√a: (³√a)^3 = a).",
              "Khái niệm căn thức bậc ba ³√A (xác định với mọi A ∈ R).",
              "Tính chất: ³√(A.B) = ³√A . ³√B; ³√(A/B) = ³√A / ³√B (B ≠ 0)."
            ],
            understanding: [
              "Tính căn bậc ba của các số thực và sử dụng máy tính cầm tay.",
              "Rút gọn biểu thức chứa căn bậc ba: ³√(A^3) = A."
            ],
            application: [
              "Tính độ dài cạnh của thùng chứa hình lập phương khi biết thể tích V."
            ]
          },
          keyConcepts: ["Căn bậc ba ³√a", "Căn thức bậc ba", "(³√a)^3 = a", "³√(a^3) = a"]
        }
      ]
    },
    {
      id: "math9_c4",
      name: "Chương IV. Hệ thức lượng trong tam giác vuông",
      lessons: [
        {
          id: "m9_b11",
          lessonNumber: "Bài 11",
          name: "Bài 11. Tỉ số lượng giác của góc nhọn",
          topicId: "math9_c4",
          topicName: "Chương IV. Hệ thức lượng trong tam giác vuông",
          periods: 4,
          learningOutcomes: {
            recognition: [
              "Định nghĩa các tỉ số lượng giác của góc nhọn α: sin α = đối/huyền, cos α = kề/huyền, tan α = đối/kề, cot α = kề/đối.",
              "Bảng giá trị lượng giác của các góc đặc biệt (30°, 45°, 60°).",
              "Tỉ số lượng giác của hai góc phụ nhau: sin α = cos β, cos α = sin β, tan α = cot β, cot α = tan β (α + β = 90°)."
            ],
            understanding: [
              "Tính các tỉ số lượng giác của góc nhọn trong tam giác vuông.",
              "Sử dụng máy tính cầm tay để tính tỉ số lượng giác và tra ngược góc nhọn khi biết tỉ số."
            ],
            application: [
              "Xác định độ dốc mặt đường, góc nghiêng của cầu dốc xe lăn."
            ]
          },
          keyConcepts: ["sin, cos, tan, cot", "Tỉ số lượng giác góc nhọn", "Hai góc phụ nhau", "Bảng lượng giác đặc biệt"]
        },
        {
          id: "m9_b12",
          lessonNumber: "Bài 12",
          name: "Bài 12. Một số hệ thức giữa cạnh, góc trong tam giác vuông và ứng dụng",
          topicId: "math9_c4",
          topicName: "Chương IV. Hệ thức lượng trong tam giác vuông",
          periods: 4,
          learningOutcomes: {
            recognition: [
              "Định lí hệ thức giữa cạnh và góc trong tam giác vuông: b = a.sin B = a.cos C; b = c.tan B = c.cot C.",
              "Khái niệm Giải tam giác vuông (tìm tất cả các cạnh và góc còn lại khi biết 2 yếu tố trong đó có ít nhất 1 cạnh)."
            ],
            understanding: [
              "Giải thành thạo bài toán giải tam giác vuông.",
              "Vận dụng để giải các bài toán thực hành đo đạc hình học."
            ],
            application: [
              "Đo chiều cao tòa lâu đài, ngọn hải đăng, bề rộng khúc sông bằng giác kế và thước cuộn."
            ]
          },
          keyConcepts: ["Hệ thức cạnh và góc", "b = a.sin B", "b = c.tan B", "Giải tam giác vuông", "Ứng dụng đo đạc thực tế"]
        }
      ]
    },
    {
      id: "math9_c5",
      name: "Chương V. Đường tròn",
      lessons: [
        {
          id: "m9_b13",
          lessonNumber: "Bài 13",
          name: "Bài 13. Mở đầu về đường tròn",
          topicId: "math9_c5",
          topicName: "Chương V. Đường tròn",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Định nghĩa đường tròn tâm O bán kính R (O; R).",
              "Vị trí tương đối của điểm M với đường tròn (OM = R: nằm trên; OM < R: nằm trong; OM > R: nằm ngoài).",
              "Tính đối xứng của đường tròn: Tâm O là tâm đối xứng; Mọi đường thẳng đi qua tâm O đều là trục đối xứng."
            ],
            understanding: [
              "Chứng minh các điểm cùng thuộc một đường tròn (dùng định lí trung tuyến trong tam giác vuông).",
              "Vẽ đường tròn đi qua ba đỉnh của tam giác."
            ],
            application: [
              "Gấp giấy tìm tâm của mảnh giấy tròn, bánh xe, mặt trống."
            ]
          },
          keyConcepts: ["Đường tròn (O; R)", "Tâm đối xứng", "Trục đối xứng", "Điểm thuộc đường tròn"]
        },
        {
          id: "m9_b14",
          lessonNumber: "Bài 14",
          name: "Bài 14. Cung và dây của một đường tròn",
          topicId: "math9_c5",
          topicName: "Chương V. Đường tròn",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Khái niệm dây cung và đường kính (đường kính là dây lớn nhất = 2R).",
              "Khái niệm góc ở tâm và số đo của cung bị chắn (số đo cung nhỏ bằng số đo góc ở tâm chắn cung đó, số đo cung lớn = 360° - số đo cung nhỏ)."
            ],
            understanding: [
              "Tính số đo cung, chứng minh quan hệ giữa dây và khoảng cách từ tâm đến dây.",
              "Vận dụng tính chất: Đường kính vuông góc với một dây thì đi qua trung điểm của dây ấy và chia đôi cung căng dây đó."
            ],
            application: [
              "Tính góc quay của kim đồng hồ, độ sâu ngập nước của bánh guồng cọn nước."
            ]
          },
          keyConcepts: ["Dây cung", "Đường kính lớn nhất", "Góc ở tâm", "Số đo cung", "Đường kính vuông góc với dây"]
        },
        {
          id: "m9_b15",
          lessonNumber: "Bài 15",
          name: "Bài 15. Độ dài của cung tròn. Diện tích hình quạt tròn và hình vành khuyên",
          topicId: "math9_c5",
          topicName: "Chương V. Đường tròn",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Công thức tính độ dài đường tròn C = 2πR = πd và độ dài cung tròn n°: l = (π.R.n)/180.",
              "Công thức diện tích hình tròn S = πR^2, diện tích hình quạt tròn Sq = (π.R^2.n)/360 = (l.R)/2.",
              "Công thức diện tích hình vành khuyên (vành khăn): Svk = π(R^2 - r^2)."
            ],
            understanding: [
              "Tính độ dài cung tròn, diện tích hình quạt tròn và hình vành khuyên.",
              "Tính diện tích hình viên phân."
            ],
            application: [
              "Tính quãng đường xe đạp đi được sau n vòng quay bàn đạp, diện tích miếng bánh pizza quạt tròn, diện tích chiếc quạt xòe."
            ]
          },
          keyConcepts: ["Độ dài cung l = (πRn)/180", "Diện tích hình quạt tròn Sq", "Hình vành khuyên Svk = π(R^2 - r^2)", "Hình viên phân"]
        },
        {
          id: "m9_b16",
          lessonNumber: "Bài 16",
          name: "Bài 16. Vị trí tương đối của đường thẳng và đường tròn",
          topicId: "math9_c5",
          topicName: "Chương V. Đường tròn",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Ba vị trí tương đối giữa đường thẳng a và đường tròn (O; R) căn cứ vào khoảng cách d từ O đến a: 1. Cắt nhau (d < R, 2 điểm chung); 2. Tiếp xúc nhau (d = R, 1 điểm chung - tiếp tuyến); 3. Không giao nhau (d > R, 0 điểm chung).",
              "Định lí về tính chất tiếp tuyến (tiếp tuyến vuông góc với bán kính tại tiếp điểm).",
              "Định lí tính chất hai tiếp tuyến cắt nhau: PA = PB, PO là phân giác góc APB, OP là phân giác góc AOB."
            ],
            understanding: [
              "Chứng minh một đường thẳng là tiếp tuyến của đường tròn.",
              "Vận dụng tính chất hai tiếp tuyến cắt nhau để tính độ dài đoạn thẳng và số đo góc."
            ],
            application: [
              "Đo đường kính puli máy móc bằng thước kẹp tiếp tuyến, thiết kế hệ ròng rọc truyền động."
            ]
          },
          keyConcepts: ["Vị trí tương đối đường thẳng và đường tròn", "Tiếp tuyến", "Tiếp điểm", "Tính chất hai tiếp tuyến cắt nhau"]
        },
        {
          id: "m9_b17",
          lessonNumber: "Bài 17",
          name: "Bài 17. Vị trí tương đối của hai đường tròn",
          topicId: "math9_c5",
          topicName: "Chương V. Đường tròn",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Các vị trí tương đối giữa hai đường tròn (O; R) và (O'; r) (R ≥ r): Cắt nhau (|R-r| < OO' < R+r); Tiếp xúc ngoài (OO' = R+r); Tiếp xúc trong (OO' = R-r); Ở ngoài nhau (OO' > R+r); Đựng nhau (OO' < R-r); Đồng tâm (OO' = 0).",
              "Tính chất đoạn nối tâm là trục đối xứng của hình gồm hai đường tròn."
            ],
            understanding: [
              "Xác định vị trí tương đối của hai đường tròn dựa trên hệ thức giữa đoạn nối tâm OO' và các bán kính R, r."
            ],
            application: [
              "Hiện tượng nhật thực, nguyệt thực (vị trí tương đối giữa Mặt Trời, Trái Đất và Mặt Trăng); thiết kế khớp nối ống tròn, bánh răng ăn khớp."
            ]
          },
          keyConcepts: ["Hai đường tròn cắt nhau", "Tiếp xúc ngoài", "Tiếp xúc trong", "Ở ngoài nhau", "Đoạn nối tâm OO'"]
        }
      ]
    },
    {
      id: "math9_c6",
      name: "Chương VI. Hàm số y = ax² (a ≠ 0). Phương trình bậc hai một ẩn",
      lessons: [
        {
          id: "m9_b18",
          lessonNumber: "Bài 18",
          name: "Bài 18. Hàm số y = ax² (a ≠ 0)",
          topicId: "math9_c6",
          topicName: "Chương VI. Hàm số y = ax² (a ≠ 0). Phương trình bậc hai một ẩn",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết tính chất của hàm số y = ax^2 (a ≠ 0): a > 0 thì hàm số đồng biến khi x > 0, nghịch biến khi x < 0, đạt GTNN tại O(0; 0); a < 0 thì hàm số đồng biến khi x < 0, nghịch biến khi x > 0, đạt GTLN tại O(0; 0).",
              "Đồ thị hàm số y = ax^2 là một đường cong Parabol nhận trục tung Oy làm trục đối xứng và đỉnh là gốc tọa độ O."
            ],
            understanding: [
              "Lập bảng giá trị (ít nhất 5 điểm) và vẽ chính xác đồ thị hàm số Parabol y = ax^2.",
              "Xác định tọa độ giao điểm của Parabol và đường thẳng."
            ],
            application: [
              "Mô tả hình dạng dây cáp cầu treo, đường cong vòi phun nước nghệ thuật, cổng vòm Parabol."
            ]
          },
          keyConcepts: ["Hàm số y = ax²", "Đồ thị Parabol", "Trục đối xứng Oy", "Đỉnh O(0; 0)", "Đồng biến - Nghịch biến"]
        },
        {
          id: "m9_b19",
          lessonNumber: "Bài 19",
          name: "Bài 19. Phương trình bậc hai một ẩn",
          topicId: "math9_c6",
          topicName: "Chương VI. Hàm số y = ax² (a ≠ 0). Phương trình bậc hai một ẩn",
          periods: 4,
          learningOutcomes: {
            recognition: [
              "Định nghĩa phương trình bậc hai một ẩn: ax^2 + bx + c = 0 (a ≠ 0).",
              "Biệt thức Δ = b^2 - 4ac và công thức nghiệm tổng quát:",
              "  • Δ > 0: hai nghiệm phân biệt x1,2 = (-b ± √Δ)/(2a);",
              "  • Δ = 0: nghiệm kép x1 = x2 = -b/(2a);",
              "  • Δ < 0: phương trình vô nghiệm.",
              "Biệt thức thu gọn Δ' = b'^2 - ac (với b = 2b') và công thức nghiệm thu gọn."
            ],
            understanding: [
              "Giải thành thạo phương trình bậc hai bằng công thức nghiệm hoặc công thức nghiệm thu gọn.",
              "Sử dụng máy tính cầm tay để kiểm tra nghiệm."
            ],
            application: [
              "Tính kích thước mảnh đất hình chữ nhật, độ sâu hồ nước khi biết diện tích."
            ]
          },
          keyConcepts: ["Phương trình bậc hai ax²+bx+c=0", "Biệt thức Δ = b²-4ac", "Biệt thức thu gọn Δ'", "Công thức nghiệm", "Nghiệm kép"]
        },
        {
          id: "m9_b20",
          lessonNumber: "Bài 20",
          name: "Bài 20. Định lí Viète và ứng dụng",
          topicId: "math9_c6",
          topicName: "Chương VI. Hàm số y = ax² (a ≠ 0). Phương trình bậc hai một ẩn",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Phát biểu Định lí Viète: Nếu x1, x2 là hai nghiệm của ax^2 + bx + c = 0 (a ≠ 0) thì S = x1 + x2 = -b/a và P = x1.x2 = c/a.",
              "Nếu hai số u và v có u + v = S và u.v = P (với S^2 - 4P ≥ 0) thì u, v là hai nghiệm của phương trình x^2 - Sx + P = 0."
            ],
            understanding: [
              "Nhẩm nghiệm phương trình bậc hai trong các trường hợp đặc biệt: a + b + c = 0 (x1 = 1, x2 = c/a) hoặc a - b + c = 0 (x1 = -1, x2 = -c/a).",
              "Tính giá trị biểu thức đối xứng của các nghiệm (x1^2 + x2^2, 1/x1 + 1/x2).",
              "Phân tích đa thức bậc hai thành nhân tử: ax^2 + bx + c = a(x - x1)(x - x2)."
            ],
            application: [
              "Tìm hai kích thước chiều dài và chiều rộng của khu vườn khi biết chu vi và diện tích."
            ]
          },
          keyConcepts: ["Định lí Viète", "S = x1 + x2 = -b/a", "P = x1.x2 = c/a", "Nhẩm nghiệm a+b+c=0", "Tìm hai số biết tổng và tích"]
        },
        {
          id: "m9_b21",
          lessonNumber: "Bài 21",
          name: "Bài 21. Giải bài toán bằng cách lập phương trình",
          topicId: "math9_c6",
          topicName: "Chương VI. Hàm số y = ax² (a ≠ 0). Phương trình bậc hai một ẩn",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nắm vững các bước giải bài toán bằng cách lập phương trình bậc hai một ẩn."
            ],
            understanding: [
              "Biểu diễn các đại lượng theo ẩn số và thiết lập phương trình bậc hai.",
              "Giải phương trình và đối chiếu điều kiện để loại nghiệm không thích hợp."
            ],
            application: [
              "Giải các dạng toán thực tế: toán hình học (chu vi, diện tích), toán chuyển động (vận tốc ô tô, ca nô xuôi/ngược dòng), toán năng suất làm chung/làm riêng, toán kinh tế lãi kép gửi ngân hàng."
            ]
          },
          keyConcepts: ["Giải bài toán bằng cách lập phương trình", "Chọn ẩn và điều kiện", "Toán chuyển động", "Toán hình học", "Toán lãi kép"]
        }
      ]
    },
    {
      id: "math9_c7",
      name: "Chương VII. Tần số và tần số tương đối",
      lessons: [
        {
          id: "m9_b22",
          lessonNumber: "Bài 22",
          name: "Bài 22. Bảng tần số và biểu đồ tần số",
          topicId: "math9_c7",
          topicName: "Chương VII. Tần số và tần số tương đối",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Khái niệm tần số m của một giá trị x (số lần xuất hiện của giá trị đó trong mẫu dữ liệu).",
              "Bảng tần số và biểu đồ tần số (dạng cột và dạng đoạn thẳng)."
            ],
            understanding: [
              "Lập bảng tần số từ mẫu dữ liệu thống kê và vẽ biểu đồ tần số.",
              "Đọc và phân tích thông tin từ biểu đồ tần số."
            ],
            application: [
              "Thống kê cỡ giày của học sinh lớp 9, khảo sát chất lượng sản phẩm."
            ]
          },
          keyConcepts: ["Tần số m", "Bảng tần số", "Biểu đồ tần số dạng cột", "Biểu đồ tần số dạng đoạn thẳng"]
        },
        {
          id: "m9_b23",
          lessonNumber: "Bài 23",
          name: "Bài 23. Bảng tần số tương đối và biểu đồ tần số tương đối",
          topicId: "math9_c7",
          topicName: "Chương VII. Tần số và tần số tương đối",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Khái niệm tần số tương đối f của một giá trị: f = (m/n) . 100% (m: tần số, n: kích thước mẫu).",
              "Bảng tần số tương đối và biểu đồ tần số tương đối (dạng cột và dạng hình quạt tròn)."
            ],
            understanding: [
              "Lập bảng tần số tương đối và vẽ biểu đồ hình quạt tròn biểu diễn tỉ lệ phần trăm các giá trị.",
              "Phân tích cơ cấu và so sánh các nhóm dữ liệu."
            ],
            application: [
              "Thống kê tỉ lệ xếp loại học lực, cơ cấu chi tiêu ngân sách, thị phần tiêu thụ ô tô."
            ]
          },
          keyConcepts: ["Tần số tương đối f = (m/n).100%", "Bảng tần số tương đối", "Biểu đồ tần số tương đối dạng cột", "Biểu đồ hình quạt tròn"]
        },
        {
          id: "m9_b24",
          lessonNumber: "Bài 24",
          name: "Bài 24. Bảng tần số, tần số tương đối ghép nhóm và biểu đồ",
          topicId: "math9_c7",
          topicName: "Chương VII. Tần số và tần số tương đối",
          periods: 4,
          learningOutcomes: {
            recognition: [
              "Khái niệm mẫu số liệu ghép nhóm [a; b) (đầu mút trái a, đầu mút phải b, giá trị đại diện x = (a+b)/2).",
              "Bảng tần số ghép nhóm, bảng tần số tương đối ghép nhóm.",
              "Biểu đồ tần số tương đối ghép nhóm dạng cột (histogram) và dạng đoạn thẳng."
            ],
            understanding: [
              "Chuyển mẫu số liệu thô thành mẫu số liệu ghép nhóm.",
              "Vẽ và phân tích biểu đồ histogram tần số tương đối ghép nhóm."
            ],
            application: [
              "Thống kê phân bố chiều cao, cân nặng của trẻ sơ sinh, thời gian tự học của học sinh."
            ]
          },
          keyConcepts: ["Mẫu số liệu ghép nhóm [a; b)", "Giá trị đại diện", "Bảng tần số ghép nhóm", "Biểu đồ Histogram"]
        }
      ]
    },
    {
      id: "math9_c8",
      name: "Chương VIII. Xác suất của biến cố trong một số mô hình xác suất đơn giản",
      lessons: [
        {
          id: "m9_b25",
          lessonNumber: "Bài 25",
          name: "Bài 25. Phép thử ngẫu nhiên và không gian mẫu",
          topicId: "math9_c8",
          topicName: "Chương VIII. Xác suất của biến cố trong một số mô hình xác suất đơn giản",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Khái niệm phép thử ngẫu nhiên và không gian mẫu Ω (tập hợp tất cả các kết quả có thể của phép thử).",
              "Mô tả không gian mẫu của phép thử nhiều bước (dùng sơ đồ hình cây hoặc bảng đôi)."
            ],
            understanding: [
              "Liệt kê đầy đủ và đếm số phần tử của không gian mẫu n(Ω) khi thực hiện đồng thời hoặc liên tiếp các hành động ngẫu nhiên."
            ],
            application: [
              "Mô hình hóa phép lai di truyền của Mendel (kiểu gen AA, Aa, aa)."
            ]
          },
          keyConcepts: ["Phép thử ngẫu nhiên", "Không gian mẫu Ω", "Sơ đồ hình cây", "Bảng liệt kê kết quả"]
        },
        {
          id: "m9_b26",
          lessonNumber: "Bài 26",
          name: "Bài 26. Xác suất của biến cố liên quan tới phép thử",
          topicId: "math9_c8",
          topicName: "Chương VIII. Xác suất của biến cố trong một số mô hình xác suất đơn giản",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Khái niệm kết quả thuận lợi cho biến cố E (tập con của không gian mẫu).",
              "Công thức xác suất cổ điển của biến cố: P(E) = n(E) / n(Ω)."
            ],
            understanding: [
              "Tính xác suất của các biến cố trong phép thử gồm hai hoặc nhiều hành động độc lập (gieo 2 đồng xu, gieo 2 con xúc xắc, rút 2 thẻ bài liên tiếp không hoàn lại)."
            ],
            application: [
              "Tính tỉ lệ xuất hiện kiểu hình hoa đỏ / hoa trắng trong di truyền học, xác suất trúng giải bốc thăm."
            ]
          },
          keyConcepts: ["Biến cố E", "Kết quả thuận lợi n(E)", "Công thức xác suất P(E) = n(E)/n(Ω)", "Xác suất phép thử nhiều bước"]
        }
      ]
    },
    {
      id: "math9_c9",
      name: "Chương IX. Đường tròn ngoại tiếp và đường tròn nội tiếp",
      lessons: [
        {
          id: "m9_b27",
          lessonNumber: "Bài 27",
          name: "Bài 27. Góc nội tiếp",
          topicId: "math9_c9",
          topicName: "Chương IX. Đường tròn ngoại tiếp và đường tròn nội tiếp",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Định nghĩa góc nội tiếp (đỉnh nằm trên đường tròn, hai cạnh chứa hai dây cung).",
              "Định lí: Số đo của góc nội tiếp bằng nửa số đo của cung bị chắn.",
              "Các hệ quả quan trọng: Các góc nội tiếp cùng chắn một cung (hoặc hai cung bằng nhau) thì bằng nhau; Góc nội tiếp chắn nửa đường tròn là góc vuông (90°)."
            ],
            understanding: [
              "Tính số đo góc nội tiếp và số đo cung bị chắn.",
              "Chứng minh các góc bằng nhau, chứng minh tam giác vuông nội tiếp đường kính."
            ],
            application: [
              "Tính góc sút bóng đá từ các vị trí khác nhau trên cung tròn sân bóng."
            ]
          },
          keyConcepts: ["Góc nội tiếp", "Cung bị chắn", "Góc nội tiếp bằng nửa góc ở tâm", "Góc nội tiếp chắn nửa đường tròn = 90°"]
        },
        {
          id: "m9_b28",
          lessonNumber: "Bài 28",
          name: "Bài 28. Đường tròn ngoại tiếp và đường tròn nội tiếp của một tam giác",
          topicId: "math9_c9",
          topicName: "Chương IX. Đường tròn ngoại tiếp và đường tròn nội tiếp",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Định nghĩa đường tròn ngoại tiếp tam giác (đi qua 3 đỉnh, tâm là giao 3 đường trung trực).",
              "Định nghĩa đường tròn nội tiếp tam giác (tiếp xúc 3 cạnh, tâm là giao 3 đường phân giác).",
              "Công thức bán kính đường tròn ngoại tiếp tam giác vuông (R = c/2) và tam giác đều (R = a√3/3, r = a√3/6)."
            ],
            understanding: [
              "Xác định tâm và tính bán kính đường tròn ngoại tiếp, nội tiếp của tam giác vuông, tam giác đều.",
              "Vẽ đường tròn ngoại tiếp và nội tiếp tam giác bằng thước kẻ và compa."
            ],
            application: [
              "Thiết kế khung đồng hồ tròn lồng vừa khít trong khung tam giác đều."
            ]
          },
          keyConcepts: ["Đường tròn ngoại tiếp tam giác", "Đường tròn nội tiếp tam giác", "Tâm đường tròn ngoại tiếp", "Tâm đường tròn nội tiếp"]
        },
        {
          id: "m9_b29",
          lessonNumber: "Bài 29",
          name: "Bài 29. Tứ giác nội tiếp",
          topicId: "math9_c9",
          topicName: "Chương IX. Đường tròn ngoại tiếp và đường tròn nội tiếp",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Định nghĩa tứ giác nội tiếp (bốn đỉnh cùng nằm trên một đường tròn).",
              "Định lí: Trong một tứ giác nội tiếp, tổng số đo hai góc đối diện bằng 180° (Â + Ĉ = 180°, B̂ + D̂ = 180°).",
              "Dấu hiệu nhận biết tứ giác nội tiếp (tổng hai góc đối bằng 180°, hai đỉnh kề cùng nhìn một cạnh dưới hai góc bằng nhau, góc ngoài bằng góc đối trong)."
            ],
            understanding: [
              "Chứng minh một tứ giác là tứ giác nội tiếp.",
              "Vận dụng tính chất tứ giác nội tiếp để tính số đo góc và chứng minh các điểm đồng viên."
            ],
            application: [
              "Giải thích hình chữ nhật, hình vuông, hình thang cân luôn nội tiếp đường tròn."
            ]
          },
          keyConcepts: ["Tứ giác nội tiếp", "Tổng hai góc đối = 180°", "Dấu hiệu nhận biết tứ giác nội tiếp"]
        },
        {
          id: "m9_b30",
          lessonNumber: "Bài 30",
          name: "Bài 30. Đa giác đều",
          topicId: "math9_c9",
          topicName: "Chương IX. Đường tròn ngoại tiếp và đường tròn nội tiếp",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Định nghĩa đa giác đều (đa giác có tất cả các cạnh bằng nhau và tất cả các góc bằng nhau: ngũ giác đều, lục giác đều, bát giác đều).",
              "Mỗi đa giác đều n cạnh luôn có một đường tròn ngoại tiếp và một đường tròn nội tiếp cùng tâm.",
              "Khái niệm Phép quay tâm O góc quay α° giữ nguyên đa giác đều."
            ],
            understanding: [
              "Tính số đo mỗi góc của đa giác đều n cạnh: (n-2).180° / n.",
              "Xác định các phép quay giữ nguyên đa giác đều."
            ],
            application: [
              "Nhận diện cấu trúc tổ ong hình lục giác đều, thiết kế gạch lát hoa văn đối xứng, bu-lông đai ốc lục giác."
            ]
          },
          keyConcepts: ["Đa giác đều", "Tam giác đều", "Hình vuông", "Lục giác đều", "Phép quay", "Tâm đối xứng"]
        }
      ]
    },
    {
      id: "math9_c10",
      name: "Chương X. Một số hình khối trong thực tiễn",
      lessons: [
        {
          id: "m9_b31",
          lessonNumber: "Bài 31",
          name: "Bài 31. Hình trụ và hình nón",
          topicId: "math9_c10",
          topicName: "Chương X. Một số hình khối trong thực tiễn",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Mô tả các yếu tố hình trụ: bán kính đáy R, chiều cao h, đường sinh l (l = h). Công thức: Sxq = 2πRh, Stp = 2πRh + 2πR^2, V = πR^2h.",
              "Mô tả các yếu tố hình nón: đỉnh S, đáy hình tròn bán kính R, đường cao h, đường sinh l (l^2 = h^2 + R^2). Công thức: Sxq = πRl, Stp = πRl + πR^2, V = 1/3 πR^2h."
            ],
            understanding: [
              "Tạo lập và vẽ hình khai triển của hình trụ, hình nón.",
              "Tính diện tích xung quanh, diện tích toàn phần và thể tích hình trụ, hình nón trong các bài toán thực tế."
            ],
            application: [
              "Tính lượng nước chứa trong thùng phi trụ, diện tích lá lợp nón bài thơ hình nón, dung tích chiếc kem ốc quế."
            ]
          },
          keyConcepts: ["Hình trụ", "Hình nón", "Đường sinh l", "Sxq hình trụ = 2πRh", "Sxq hình nón = πRl", "V hình trụ = πR²h", "V hình nón = 1/3 πR²h"]
        },
        {
          id: "m9_b32",
          lessonNumber: "Bài 32",
          name: "Bài 32. Hình cầu",
          topicId: "math9_c10",
          topicName: "Chương X. Một số hình khối trong thực tiễn",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Mô tả mặt cầu tâm O bán kính R và hình cầu.",
              "Công thức diện tích mặt cầu: S = 4πR^2 = πd^2.",
              "Công thức thể tích hình cầu: V = 4/3 πR^3."
            ],
            understanding: [
              "Khi cắt mặt cầu bởi một mặt phẳng, thiết diện luôn là một đường tròn.",
              "Tính diện tích mặt cầu và thể tích hình cầu khi biết bán kính hoặc đường kính."
            ],
            application: [
              "Tính diện tích da bọc quả bóng đá tiêu chuẩn FIFA, thể tích Trái Đất, lượng sơn bọc khinh khí cầu."
            ]
          },
          keyConcepts: ["Mặt cầu", "Hình cầu", "Bán kính R", "S mặt cầu = 4πR²", "V hình cầu = 4/3 πR³", "Đường tròn lớn"]
        }
      ]
    }
  ]
};
