import { TextbookGrade } from "../textbooks";

export const MATH_TEXTBOOK_GRADE_7: TextbookGrade = {
  grade: "7",
  bookSeries: "Kết nối tri thức với cuộc sống",
  title: "Toán học 7 - Bộ sách Kết nối tri thức với cuộc sống",
  description: "Chuẩn kiến thức, kĩ năng theo Chương trình GDPT 2018 môn Toán lớp 7 (Tập 1 & Tập 2)",
  topics: [
    {
      id: "math7_c1",
      name: "Chương I. Số hữu tỉ",
      lessons: [
        {
          id: "m7_b1",
          lessonNumber: "Bài 1",
          name: "Bài 1. Tập hợp các số hữu tỉ",
          topicId: "math7_c1",
          topicName: "Chương I. Số hữu tỉ",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết số hữu tỉ là số viết được dưới dạng phân số a/b (a, b ∈ Z, b ≠ 0) và tập hợp Q.",
              "Biết biểu diễn số hữu tỉ trên trục số."
            ],
            understanding: [
              "Tìm số đối của một số hữu tỉ: -(a/b) = (-a)/b = a/(-b).",
              "So sánh hai số hữu tỉ bất kì bằng cách đưa về cùng mẫu số dương hoặc dùng số trung gian."
            ],
            application: [
              "Sử dụng số hữu tỉ để mô tả các đại lượng thực tế (nhiệt độ, độ cao, tỉ lệ tài chính)."
            ]
          },
          keyConcepts: ["Số hữu tỉ Q", "Biểu diễn trên trục số", "Số đối", "So sánh số hữu tỉ"]
        },
        {
          id: "m7_b2",
          lessonNumber: "Bài 2",
          name: "Bài 2. Cộng, trừ, nhân, chia số hữu tỉ",
          topicId: "math7_c1",
          topicName: "Chương I. Số hữu tỉ",
          periods: 4,
          learningOutcomes: {
            recognition: [
              "Nắm vững các quy tắc cộng, trừ, nhân, chia số hữu tỉ.",
              "Nhận biết các tính chất giao hoán, kết hợp, phân phối của phép toán trong Q."
            ],
            understanding: [
              "Thực hiện thành thạo các phép tính với số hữu tỉ (dạng phân số và số thập phân).",
              "Vận dụng tính chất phép tính để tính nhanh, tính nhẩm hợp lí."
            ],
            application: [
              "Giải các bài toán thực tế có liên quan đến tính toán tiền lương, chiết khấu, đo đạc."
            ]
          },
          keyConcepts: ["Cộng trừ số hữu tỉ", "Nhân chia số hữu tỉ", "Tính nhanh trong Q"]
        },
        {
          id: "m7_b3",
          lessonNumber: "Bài 3",
          name: "Bài 3. Luỹ thừa với số mũ tự nhiên của một số hữu tỉ",
          topicId: "math7_c1",
          topicName: "Chương I. Số hữu tỉ",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết khái niệm lũy thừa với số mũ tự nhiên của một số hữu tỉ: (x/y)^n = x^n / y^n.",
              "Nắm quy tắc nhân chia cùng cơ số và lũy thừa của lũy thừa: (x^m)^n = x^(m.n); (x.y)^n = x^n . y^n."
            ],
            understanding: [
              "Tính đúng giá trị lũy thừa của số hữu tỉ và rút gọn các biểu thức chứa lũy thừa."
            ],
            application: [
              "Tìm số hữu tỉ x hoặc số tự nhiên n trong các đẳng thức lũy thừa."
            ]
          },
          keyConcepts: ["Lũy thừa số hữu tỉ", "Nhân chia cùng cơ số", "Lũy thừa của lũy thừa", "Lũy thừa của một tích"]
        },
        {
          id: "m7_b4",
          lessonNumber: "Bài 4",
          name: "Bài 4. Thứ tự thực hiện các phép tính. Quy tắc chuyển vế",
          topicId: "math7_c1",
          topicName: "Chương I. Số hữu tỉ",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nắm vững thứ tự thực hiện phép tính và quy tắc dấu ngoặc trong tập hợp Q.",
              "Nhận biết quy tắc chuyển vế: khi chuyển một số hạng từ vế này sang vế kia của một đẳng thức, ta phải đổi dấu số hạng đó."
            ],
            understanding: [
              "Áp dụng thành thạo quy tắc chuyển vế để tìm giá trị của x trong các bài toán tìm x."
            ],
            application: [
              "Thiết lập đẳng thức từ bài toán có lời văn và giải tìm ẩn số thực tế."
            ]
          },
          keyConcepts: ["Thứ tự phép tính", "Quy tắc chuyển vế", "Đổi dấu khi chuyển vế", "Tìm x trong Q"]
        }
      ]
    },
    {
      id: "math7_c2",
      name: "Chương II. Số thực",
      lessons: [
        {
          id: "m7_b5",
          lessonNumber: "Bài 5",
          name: "Bài 5. Làm quen với số thập phân vô hạn tuần hoàn",
          topicId: "math7_c2",
          topicName: "Chương II. Số thực",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết số thập phân hữu hạn và số thập phân vô hạn tuần hoàn, chu kì của số thập phân vô hạn tuần hoàn."
            ],
            understanding: [
              "Biết cách viết một phân số tối giản thành số thập phân hữu hạn hoặc vô hạn tuần hoàn.",
              "Làm tròn số thập phân với độ chính xác cho trước (dùng kí hiệu ≈)."
            ],
            application: [
              "Ước lượng sai số và làm tròn kết quả đo đạc trong khoa học tự nhiên."
            ]
          },
          keyConcepts: ["Số thập phân hữu hạn", "Số thập phân vô hạn tuần hoàn", "Chu kì", "Độ chính xác"]
        },
        {
          id: "m7_b6",
          lessonNumber: "Bài 6",
          name: "Bài 6. Số vô tỉ. Căn bậc hai số học",
          topicId: "math7_c2",
          topicName: "Chương II. Số thực",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết khái niệm số vô tỉ (số thập phân vô hạn không tuần hoàn như π, √2).",
              "Khái niệm căn bậc hai số học của một số không âm a (√a = x sao cho x ≥ 0 và x^2 = a)."
            ],
            understanding: [
              "Tính được căn bậc hai số học của các số chính phương.",
              "Sử dụng máy tính cầm tay để tính giá trị gần đúng của căn bậc hai số học."
            ],
            application: [
              "Tính độ dài cạnh hình vuông khi biết diện tích của nó."
            ]
          },
          keyConcepts: ["Số vô tỉ", "Căn bậc hai số học", "Dấu căn √", "Số chính phương"]
        },
        {
          id: "m7_b7",
          lessonNumber: "Bài 7",
          name: "Bài 7. Tập hợp các số thực",
          topicId: "math7_c2",
          topicName: "Chương II. Số thực",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết tập hợp số thực R bao gồm cả số hữu tỉ Q và số vô tỉ I.",
              "Khái niệm giá trị tuyệt đối của một số thực |x|."
            ],
            understanding: [
              "Biểu diễn số thực trên trục số và so sánh hai số thực bất kì.",
              "Tính giá trị tuyệt đối của một số thực."
            ],
            application: [
              "Tính khoảng cách trên trục số và sai số trong đo lường."
            ]
          },
          keyConcepts: ["Tập hợp số thực R", "Số vô tỉ I", "Trục số thực", "Giá trị tuyệt đối |x|"]
        }
      ]
    },
    {
      id: "math7_c3",
      name: "Chương III. Góc và đường thẳng song song",
      lessons: [
        {
          id: "m7_b8",
          lessonNumber: "Bài 8",
          name: "Bài 8. Góc ở vị trí đặc biệt. Tia phân giác của một góc",
          topicId: "math7_c3",
          topicName: "Chương III. Góc và đường thẳng song song",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết hai góc kề bù (tổng bằng 180°), hai góc đối đỉnh (bằng nhau).",
              "Nhận biết tia phân giác của một góc (chia góc thành hai góc bằng nhau)."
            ],
            understanding: [
              "Tính số đo góc dựa vào tính chất hai góc kề bù, đối đỉnh và tia phân giác.",
              "Vẽ tia phân giác của một góc bằng thước đo góc hoặc thước thẳng và compa."
            ],
            application: [
              "Ứng dụng căn chỉnh góc nghiêng trong thiết kế kỹ thuật, cắt góc bánh chưng."
            ]
          },
          keyConcepts: ["Hai góc kề bù", "Hai góc đối đỉnh", "Tia phân giác", "Tính số đo góc"]
        },
        {
          id: "m7_b9",
          lessonNumber: "Bài 9",
          name: "Bài 9. Hai đường thẳng song song và dấu hiệu nhận biết",
          topicId: "math7_c3",
          topicName: "Chương III. Góc và đường thẳng song song",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết các cặp góc so le trong, cặp góc đồng vị khi một đường thẳng cắt hai đường thẳng.",
              "Nắm dấu hiệu nhận biết hai đường thẳng song song (hai góc so le trong bằng nhau hoặc hai góc đồng vị bằng nhau)."
            ],
            understanding: [
              "Vẽ hai đường thẳng song song bằng thước kẻ và êke.",
              "Chứng minh hai đường thẳng song song dựa vào các cặp góc so le trong, đồng vị."
            ],
            application: [
              "Kiểm tra các thanh rui mè, song cửa sổ, hàng rào có song song với nhau hay không."
            ]
          },
          keyConcepts: ["Góc so le trong", "Góc đồng vị", "Dấu hiệu hai đường thẳng song song"]
        },
        {
          id: "m7_b10",
          lessonNumber: "Bài 10",
          name: "Bài 10. Tiên đề Euclid. Tính chất của hai đường thẳng song song",
          topicId: "math7_c3",
          topicName: "Chương III. Góc và đường thẳng song song",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Phát biểu tiên đề Euclid về đường thẳng song song (qua điểm ở ngoài đường thẳng chỉ có duy nhất một đường thẳng song song).",
              "Nắm tính chất: nếu một đường thẳng cắt hai đường thẳng song song thì hai góc so le trong bằng nhau, hai góc đồng vị bằng nhau."
            ],
            understanding: [
              "Vận dụng tính chất hai đường thẳng song song để tính số đo các góc còn lại trong hình vẽ.",
              "Chứng minh quan hệ từ vuông góc đến song song (cùng vuông góc với đường thứ ba thì song song)."
            ],
            application: [
              "Thiết kế đường ray tàu hỏa, kẻ vạch đường chạy thể thao."
            ]
          },
          keyConcepts: ["Tiên đề Euclid", "Tính chất hai đường thẳng song song", "Từ vuông góc đến song song"]
        },
        {
          id: "m7_b11",
          lessonNumber: "Bài 11",
          name: "Bài 11. Định lí và chứng minh định lí",
          topicId: "math7_c3",
          topicName: "Chương III. Góc và đường thẳng song song",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết cấu trúc của một định lí gồm hai phần: Giả thiết (GT) và Kết luận (KL).",
              "Khái niệm chứng minh định lí (dùng lập luận suy diễn từ giả thiết đến kết luận)."
            ],
            understanding: [
              "Xác định được giả thiết và kết luận của một định lí cho trước dưới dạng 'Nếu... thì...'.",
              "Trình bày bài toán chứng minh hình học đơn giản theo các bước chặt chẽ."
            ],
            application: [
              "Rèn luyện tư duy logic và suy luận chứng minh trong cuộc sống."
            ]
          },
          keyConcepts: ["Định lí", "Giả thiết (GT)", "Kết luận (KL)", "Chứng minh định lí"]
        }
      ]
    },
    {
      id: "math7_c4",
      name: "Chương IV. Tam giác bằng nhau",
      lessons: [
        {
          id: "m7_b12",
          lessonNumber: "Bài 12",
          name: "Bài 12. Tổng các góc trong một tam giác",
          topicId: "math7_c4",
          topicName: "Chương IV. Tam giác bằng nhau",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Định lí tổng ba góc trong một tam giác bằng 180°.",
              "Khái niệm tam giác nhọn, tam giác vuông, tam giác tù.",
              "Khái niệm góc ngoài của tam giác (bằng tổng hai góc trong không kề với nó)."
            ],
            understanding: [
              "Tính số đo một góc của tam giác khi biết hai góc còn lại.",
              "Chứng minh hai góc nhọn trong tam giác vuông phụ nhau (tổng bằng 90°)."
            ],
            application: [
              "Đo đạc và tính góc nghiêng của mái nhà, khung cầu thang sắt."
            ]
          },
          keyConcepts: ["Tổng ba góc = 180°", "Tam giác vuông, nhọn, tù", "Góc ngoài tam giác"]
        },
        {
          id: "m7_b13",
          lessonNumber: "Bài 13",
          name: "Bài 13. Hai tam giác bằng nhau. Trường hợp bằng nhau thứ nhất của tam giác",
          topicId: "math7_c4",
          topicName: "Chương IV. Tam giác bằng nhau",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Định nghĩa hai tam giác bằng nhau và kí hiệu các đỉnh tương ứng (ΔABC = ΔA'B'C').",
              "Phát biểu trường hợp bằng nhau thứ nhất: cạnh - cạnh - cạnh (c-c-c)."
            ],
            understanding: [
              "Chứng minh hai tam giác bằng nhau theo trường hợp c-c-c và suy ra các góc, các cạnh tương ứng bằng nhau."
            ],
            application: [
              "Ứng dụng tính cứng vững của giàn khung tam giác trong kết cấu xây dựng cầu đường."
            ]
          },
          keyConcepts: ["Hai tam giác bằng nhau", "Đỉnh tương ứng", "Trường hợp cạnh - cạnh - cạnh (c-c-c)"]
        },
        {
          id: "m7_b14",
          lessonNumber: "Bài 14",
          name: "Bài 14. Trường hợp bằng nhau thứ hai và thứ ba của tam giác",
          topicId: "math7_c4",
          topicName: "Chương IV. Tam giác bằng nhau",
          periods: 4,
          learningOutcomes: {
            recognition: [
              "Phát biểu trường hợp bằng nhau thứ hai: cạnh - góc - cạnh (c-g-c, góc xen giữa hai cạnh).",
              "Phát biểu trường hợp bằng nhau thứ ba: góc - cạnh - góc (g-c-g, cạnh xen giữa hai góc)."
            ],
            understanding: [
              "Chứng minh hai tam giác bằng nhau theo trường hợp c-g-c hoặc g-c-g.",
              "Suy ra các đoạn thẳng bằng nhau, các góc bằng nhau."
            ],
            application: [
              "Đo khoảng cách giữa hai điểm ngắm từ xa qua sông mà không cần lội qua sông."
            ]
          },
          keyConcepts: ["Trường hợp cạnh - góc - cạnh (c-g-c)", "Trường hợp góc - cạnh - góc (g-c-g)", "Góc xen giữa", "Cạnh kề"]
        },
        {
          id: "m7_b15",
          lessonNumber: "Bài 15",
          name: "Bài 15. Các trường hợp bằng nhau của tam giác vuông",
          topicId: "math7_c4",
          topicName: "Chương IV. Tam giác bằng nhau",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết các trường hợp bằng nhau của tam giác vuông: hai cạnh góc vuông (c-g-c), cạnh góc vuông - góc nhọn kề (g-c-g), cạnh huyền - góc nhọn, cạnh huyền - cạnh góc vuông."
            ],
            understanding: [
              "Vận dụng thành thạo các trường hợp bằng nhau đặc biệt của tam giác vuông để chứng minh hình học."
            ],
            application: [
              "Kiểm tra độ cân xứng của giàn mái, kết cấu khung đỡ hình chữ A."
            ]
          },
          keyConcepts: ["Hai cạnh góc vuông", "Cạnh góc vuông - góc nhọn", "Cạnh huyền - góc nhọn", "Cạnh huyền - cạnh góc vuông"]
        },
        {
          id: "m7_b16",
          lessonNumber: "Bài 16",
          name: "Bài 16. Tam giác cân. Đường trung trực của đoạn thẳng",
          topicId: "math7_c4",
          topicName: "Chương IV. Tam giác bằng nhau",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Định nghĩa tam giác cân (hai cạnh bằng nhau, hai góc ở đáy bằng nhau), tam giác đều (ba cạnh bằng nhau, ba góc bằng 60°).",
              "Định nghĩa đường trung trực của đoạn thẳng (vuông góc tại trung điểm)."
            ],
            understanding: [
              "Nắm tính chất: điểm nằm trên đường trung trực thì cách đều hai đầu mút đoạn thẳng và ngược lại.",
              "Chứng minh một tam giác là tam giác cân, tam giác đều."
            ],
            application: [
              "Xác định vị trí dựng cột ăng-ten để thu phát tín hiệu đều cho hai khu vực."
            ]
          },
          keyConcepts: ["Tam giác cân", "Tam giác đều", "Đường trung trực", "Cách đều hai đầu mút"]
        }
      ]
    },
    {
      id: "math7_c5",
      name: "Chương V. Thu thập và biểu diễn dữ liệu",
      lessons: [
        {
          id: "m7_b17",
          lessonNumber: "Bài 17",
          name: "Bài 17. Thu thập và phân loại dữ liệu",
          topicId: "math7_c5",
          topicName: "Chương V. Thu thập và biểu diễn dữ liệu",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Phân biệt dữ liệu định tính (chữ, danh mục) và dữ liệu định lượng (số liệu, đo đếm).",
              "Nhận biết tính đại diện và tính hợp lí của dữ liệu thu thập."
            ],
            understanding: [
              "Lập kế hoạch thu thập dữ liệu bằng bảng hỏi, phỏng vấn, tra cứu số liệu thống kê.",
              "Phát hiện các dữ liệu bất thường hoặc không hợp lí."
            ],
            application: [
              "Khảo sát thời gian tự học ở nhà và môn thể thao yêu thích của học sinh khối 7."
            ]
          },
          keyConcepts: ["Dữ liệu định tính", "Dữ liệu định lượng", "Phân loại dữ liệu", "Tính hợp lí của dữ liệu"]
        },
        {
          id: "m7_b18",
          lessonNumber: "Bài 18",
          name: "Bài 18. Biểu đồ hình quạt tròn",
          topicId: "math7_c5",
          topicName: "Chương V. Thu thập và biểu diễn dữ liệu",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Đọc và hiểu các thành phần của biểu đồ hình quạt tròn (tỉ lệ phần trăm các hình quạt tạo thành 100%)."
            ],
            understanding: [
              "Phân tích dữ liệu từ biểu đồ hình quạt tròn để tính số lượng thực tế và rút ra nhận xét xu hướng."
            ],
            application: [
              "Đọc biểu đồ phân bổ ngân sách chi tiêu gia đình hoặc cơ cấu kinh tế các ngành."
            ]
          },
          keyConcepts: ["Biểu đồ hình quạt tròn", "Tỉ lệ phần trăm", "Phân tích cơ cấu"]
        },
        {
          id: "m7_b19",
          lessonNumber: "Bài 19",
          name: "Bài 19. Biểu đồ đoạn thẳng",
          topicId: "math7_c5",
          topicName: "Chương V. Thu thập và biểu diễn dữ liệu",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết các trục tọa độ, mốc thời gian và điểm biểu diễn trong biểu đồ đoạn thẳng."
            ],
            understanding: [
              "Vẽ biểu đồ đoạn thẳng biểu diễn số liệu biến thiên theo thời gian.",
              "Nhận xét xu hướng tăng, giảm hoặc ổn định của dữ liệu."
            ],
            application: [
              "Theo dõi biểu đồ dự báo thời tiết tuần hoặc biểu đồ tăng trưởng dân số, GDP."
            ]
          },
          keyConcepts: ["Biểu đồ đoạn thẳng", "Xu hướng biến thiên", "Trục thời gian"]
        }
      ]
    },
    {
      id: "math7_c6",
      name: "Chương VI. Tỉ lệ thức và đại lượng tỉ lệ",
      lessons: [
        {
          id: "m7_b20",
          lessonNumber: "Bài 20",
          name: "Bài 20. Tỉ lệ thức",
          topicId: "math7_c6",
          topicName: "Chương VI. Tỉ lệ thức và đại lượng tỉ lệ",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Định nghĩa tỉ lệ thức là đẳng thức của hai tỉ số: a/b = c/d.",
              "Nắm tính chất cơ bản: a.d = b.c và các hoán vị của tỉ lệ thức."
            ],
            understanding: [
              "Tìm một số hạng chưa biết trong tỉ lệ thức (tìm x).",
              "Lập tất cả các tỉ lệ thức có thể từ một đẳng thức tích a.d = b.c."
            ],
            application: [
              "Tính toán kích thước quốc kì theo tỉ lệ quy chuẩn 2:3, pha chế tỉ lệ nguyên liệu."
            ]
          },
          keyConcepts: ["Tỉ lệ thức a/b = c/d", "Tính chất a.d = b.c", "Tìm x trong tỉ lệ thức"]
        },
        {
          id: "m7_b21",
          lessonNumber: "Bài 21",
          name: "Bài 21. Tính chất của dãy tỉ số bằng nhau",
          topicId: "math7_c6",
          topicName: "Chương VI. Tỉ lệ thức và đại lượng tỉ lệ",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nắm tính chất dãy tỉ số bằng nhau: a/b = c/d = e/f = (a+c+e)/(b+d+f) = (a-c+e)/(b-d+f)."
            ],
            understanding: [
              "Áp dụng tính chất dãy tỉ số bằng nhau để giải bài toán chia phần tỉ lệ: tìm x, y, z."
            ],
            application: [
              "Chia tiền thưởng, đóng góp từ thiện, phân bổ chỉ tiêu trồng cây theo tỉ lệ số học sinh."
            ]
          },
          keyConcepts: ["Dãy tỉ số bằng nhau", "Bài toán chia tỉ lệ", "Tìm x, y, z"]
        },
        {
          id: "m7_b22",
          lessonNumber: "Bài 22",
          name: "Bài 22. Đại lượng tỉ lệ thuận",
          topicId: "math7_c6",
          topicName: "Chương VI. Tỉ lệ thức và đại lượng tỉ lệ",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Định nghĩa hai đại lượng tỉ lệ thuận: y liên hệ với x theo công thức y = ax (a ≠ 0).",
              "Nắm tính chất: tỉ số hai giá trị tương ứng của chúng luôn không đổi (y1/x1 = y2/x2 = a)."
            ],
            understanding: [
              "Xác định hệ số tỉ lệ thuận và biểu diễn quan hệ giữa hai đại lượng tỉ lệ thuận.",
              "Giải các bài toán thực tế về đại lượng tỉ lệ thuận (quãng đường - thời gian, khối lượng - giá tiền)."
            ],
            application: [
              "Tính khối lượng nguyên liệu làm bánh chưng, tiền mua tập vở theo số lượng."
            ]
          },
          keyConcepts: ["Đại lượng tỉ lệ thuận", "Hệ số tỉ lệ a", "y = ax", "Tính chất tỉ lệ thuận"]
        },
        {
          id: "m7_b23",
          lessonNumber: "Bài 23",
          name: "Bài 23. Đại lượng tỉ lệ nghịch",
          topicId: "math7_c6",
          topicName: "Chương VI. Tỉ lệ thức và đại lượng tỉ lệ",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Định nghĩa hai đại lượng tỉ lệ nghịch: y liên hệ với x theo công thức y = a/x hay x.y = a (a ≠ 0).",
              "Nắm tính chất: tích hai giá trị tương ứng của chúng luôn không đổi (x1.y1 = x2.y2 = a)."
            ],
            understanding: [
              "Xác định hệ số tỉ lệ nghịch và giải các bài toán về đại lượng tỉ lệ nghịch.",
              "Phân biệt rõ ràng giữa bài toán tỉ lệ thuận và tỉ lệ nghịch."
            ],
            application: [
              "Tính thời gian đi trên cùng quãng đường khi thay đổi vận tốc, phân chia công việc theo số lượng thợ xây."
            ]
          },
          keyConcepts: ["Đại lượng tỉ lệ nghịch", "Hệ số tỉ lệ a", "y = a/x", "x.y = a"]
        }
      ]
    },
    {
      id: "math7_c7",
      name: "Chương VII. Biểu thức đại số và đa thức một biến",
      lessons: [
        {
          id: "m7_b24",
          lessonNumber: "Bài 24",
          name: "Bài 24. Biểu thức đại số",
          topicId: "math7_c7",
          topicName: "Chương VII. Biểu thức đại số và đa thức một biến",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết biểu thức số và biểu thức đại số chứa chữ (biến số).",
              "Khái niệm giá trị của biểu thức đại số tại một giá trị cụ thể của biến."
            ],
            understanding: [
              "Viết biểu thức đại số biểu thị một đại lượng thực tế.",
              "Tính đúng giá trị của biểu thức đại số khi thay biến bằng số cho trước."
            ],
            application: [
              "Tính tiền điện thoại hàng tháng, lượng nước tưới tiêu dựa trên công thức chứa biến."
            ]
          },
          keyConcepts: ["Biểu thức đại số", "Biến số", "Giá trị của biểu thức"]
        },
        {
          id: "m7_b25",
          lessonNumber: "Bài 25",
          name: "Bài 25. Đa thức một biến",
          topicId: "math7_c7",
          topicName: "Chương VII. Biểu thức đại số và đa thức một biến",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết đơn thức một biến, đa thức một biến và các hạng tử của nó.",
              "Xác định bậc của đa thức, hệ số cao nhất, hệ số tự do."
            ],
            understanding: [
              "Thu gọn đa thức và sắp xếp các hạng tử theo lũy thừa giảm dần hoặc tăng dần của biến.",
              "Nhận biết và kiểm tra nghiệm của đa thức một biến (giá trị x làm P(x) = 0)."
            ],
            application: [
              "Tính độ cao vật rơi theo thời gian t: H = -5t^2 + 15t."
            ]
          },
          keyConcepts: ["Đa thức một biến P(x)", "Bậc của đa thức", "Hệ số cao nhất", "Hệ số tự do", "Nghiệm của đa thức"]
        },
        {
          id: "m7_b26",
          lessonNumber: "Bài 26",
          name: "Bài 26. Phép cộng và phép trừ đa thức một biến",
          topicId: "math7_c7",
          topicName: "Chương VII. Biểu thức đại số và đa thức một biến",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết quy tắc cộng, trừ hai đa thức một biến theo hàng ngang (bỏ ngoặc, nhóm hạng tử cùng bậc) hoặc đặt tính theo cột dọc."
            ],
            understanding: [
              "Thực hiện thành thạo phép cộng và phép trừ hai đa thức một biến.",
              "Vận dụng tính chất giao hoán, kết hợp để tính tổng và hiệu."
            ],
            application: [
              "Tính diện tích phần đất còn lại sau khi xây bồn hoa hình học."
            ]
          },
          keyConcepts: ["Cộng đa thức một biến", "Trừ đa thức một biến", "Đặt tính cột dọc"]
        },
        {
          id: "m7_b27",
          lessonNumber: "Bài 27",
          name: "Bài 27. Phép nhân đa thức một biến",
          topicId: "math7_c7",
          topicName: "Chương VII. Biểu thức đại số và đa thức một biến",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nắm quy tắc nhân đơn thức với đa thức: a.x^m . b.x^n = (a.b)x^(m+n).",
              "Nắm quy tắc nhân đa thức với đa thức một biến."
            ],
            understanding: [
              "Thực hiện thành thạo phép nhân đa thức một biến theo hàng ngang và đặt tính cột dọc.",
              "Rút gọn biểu thức chứa tích các đa thức."
            ],
            application: [
              "Tính thể tích hình hộp chữ nhật có các cạnh biểu thị bởi đa thức chứa biến."
            ]
          },
          keyConcepts: ["Nhân đơn thức với đa thức", "Nhân đa thức với đa thức", "Đặt tính nhân cột dọc"]
        },
        {
          id: "m7_b28",
          lessonNumber: "Bài 28",
          name: "Bài 28. Phép chia đa thức một biến",
          topicId: "math7_c7",
          topicName: "Chương VII. Biểu thức đại số và đa thức một biến",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết phép chia hết và phép chia có dư của hai đa thức một biến: A = B.Q + R (với bậc của R nhỏ hơn bậc của B hoặc R = 0)."
            ],
            understanding: [
              "Thực hiện thành thạo thuật toán đặt tính chia đa thức cho đa thức một biến đã sắp xếp.",
              "Xác định thương Q và dư R trong phép chia."
            ],
            application: [
              "Tìm điều kiện của tham số để đa thức chia hết cho đa thức."
            ]
          },
          keyConcepts: ["Chia đa thức một biến", "Phép chia hết", "Phép chia có dư", "Đa thức thương Q", "Đa thức dư R"]
        }
      ]
    },
    {
      id: "math7_c8",
      name: "Chương VIII. Làm quen với biến cố và xác suất của biến cố",
      lessons: [
        {
          id: "m7_b29",
          lessonNumber: "Bài 29",
          name: "Bài 29. Làm quen với biến cố",
          topicId: "math7_c8",
          topicName: "Chương VIII. Làm quen với biến cố và xác suất của biến cố",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết khái niệm biến cố, biến cố chắc chắn, biến cố không thể và biến cố ngẫu nhiên trong các tình huống thực tế."
            ],
            understanding: [
              "Phân biệt và xếp loại chính xác các biến cố xảy ra khi thực hiện một phép thử đơn giản (gieo xúc xắc, quay vòng quay may mắn, rút thẻ bài)."
            ],
            application: [
              "Dự đoán tính ngẫu nhiên của các hiện tượng tự nhiên và trò chơi thể thao."
            ]
          },
          keyConcepts: ["Biến cố", "Biến cố chắc chắn", "Biến cố không thể", "Biến cố ngẫu nhiên"]
        },
        {
          id: "m7_b30",
          lessonNumber: "Bài 30",
          name: "Bài 30. Làm quen với xác suất của biến cố",
          topicId: "math7_c8",
          topicName: "Chương VIII. Làm quen với biến cố và xác suất của biến cố",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết xác suất là một số từ 0 đến 1 đo lường khả năng xảy ra của biến cố.",
              "Xác suất của biến cố chắc chắn là 1 (100%), của biến cố không thể là 0 (0%).",
              "Khái niệm các biến cố đồng khả năng."
            ],
            understanding: [
              "Tính xác suất của biến cố trong mô hình đồng khả năng: P = k/n (k: số kết quả thuận lợi, n: tổng số kết quả có thể)."
            ],
            application: [
              "Đọc hiểu dự báo xác suất mưa trong ngày, tính cơ hội trúng thưởng trong trò rút thăm."
            ]
          },
          keyConcepts: ["Xác suất của biến cố", "Đồng khả năng", "P = k/n", "Thang đo xác suất từ 0 đến 1"]
        }
      ]
    },
    {
      id: "math7_c9",
      name: "Chương IX. Quan hệ giữa các yếu tố trong một tam giác",
      lessons: [
        {
          id: "m7_b31",
          lessonNumber: "Bài 31",
          name: "Bài 31. Quan hệ giữa góc và cạnh đối diện trong một tam giác",
          topicId: "math7_c9",
          topicName: "Chương IX. Quan hệ giữa các yếu tố trong một tam giác",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Trong một tam giác, góc đối diện với cạnh lớn hơn là góc lớn hơn.",
              "Cạnh đối diện với góc lớn hơn là cạnh lớn hơn.",
              "Trong tam giác vuông, góc vuông lớn nhất nên cạnh huyền là cạnh lớn nhất."
            ],
            understanding: [
              "So sánh các cạnh của một tam giác khi biết số đo các góc và ngược lại."
            ],
            application: [
              "Xác định khoảng cách xa nhất/gần nhất trong các tình huống thực địa."
            ]
          },
          keyConcepts: ["Góc đối diện cạnh", "Cạnh đối diện góc", "Cạnh huyền lớn nhất"]
        },
        {
          id: "m7_b32",
          lessonNumber: "Bài 32",
          name: "Bài 32. Quan hệ giữa đường vuông góc và đường xiên",
          topicId: "math7_c9",
          topicName: "Chương IX. Quan hệ giữa các yếu tố trong một tam giác",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Khái niệm đường vuông góc AH và đường xiên AM kẻ từ một điểm A ngoài đường thẳng d.",
              "Khái niệm khoảng cách từ một điểm đến một đường thẳng (độ dài đoạn vuông góc AH)."
            ],
            understanding: [
              "Nắm định lí: trong các đường xiên và đường vuông góc kẻ từ một điểm đến một đường thẳng, đường vuông góc là đường ngắn nhất (AH < AM)."
            ],
            application: [
              "Chọn đường bơi ngắn nhất để sang bờ bên kia, đo khoảng cách ngắn nhất từ nhà đến đường quốc lộ."
            ]
          },
          keyConcepts: ["Đường vuông góc", "Đường xiên", "Khoảng cách từ điểm đến đường thẳng", "Đoạn vuông góc ngắn nhất"]
        },
        {
          id: "m7_b33",
          lessonNumber: "Bài 33",
          name: "Bài 33. Quan hệ giữa ba cạnh của một tam giác",
          topicId: "math7_c9",
          topicName: "Chương IX. Quan hệ giữa các yếu tố trong một tam giác",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Định lí bất đẳng thức tam giác: trong một tam giác, độ dài một cạnh bất kì luôn nhỏ hơn tổng độ dài hai cạnh còn lại và lớn hơn hiệu độ dài hai cạnh còn lại (|b-c| < a < b+c)."
            ],
            understanding: [
              "Kiểm tra bộ ba độ dài đoạn thẳng có thể tạo thành một tam giác hay không."
            ],
            application: [
              "Tìm độ dài số nguyên của cạnh thứ ba khi biết hai cạnh của tam giác."
            ]
          },
          keyConcepts: ["Bất đẳng thức tam giác", "|b-c| < a < b+c", "Điều kiện lập thành tam giác"]
        },
        {
          id: "m7_b34",
          lessonNumber: "Bài 34",
          name: "Bài 34. Sự đồng quy của ba đường trung tuyến, ba đường phân giác trong một tam giác",
          topicId: "math7_c9",
          topicName: "Chương IX. Quan hệ giữa các yếu tố trong một tam giác",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Định nghĩa đường trung tuyến và đường phân giác của tam giác.",
              "Tính chất đồng quy của 3 đường trung tuyến tại Trọng tâm G (GA = 2/3 AM, GM = 1/3 AM).",
              "Tính chất đồng quy của 3 đường phân giác tại một điểm I (cách đều ba cạnh của tam giác)."
            ],
            understanding: [
              "Vận dụng tính chất trọng tâm để tính độ dài các đoạn thẳng.",
              "Chứng minh các tam giác bằng nhau và suy ra các góc bằng nhau."
            ],
            application: [
              "Xác định trọng tâm miếng bìa hình tam giác để đặt thăng bằng trên đầu ngón tay."
            ]
          },
          keyConcepts: ["Đường trung tuyến", "Trọng tâm G", "Tỉ lệ 2/3", "Đường phân giác", "Cách đều ba cạnh"]
        },
        {
          id: "m7_b35",
          lessonNumber: "Bài 35",
          name: "Bài 35. Sự đồng quy của ba đường trung trực, ba đường cao trong một tam giác",
          topicId: "math7_c9",
          topicName: "Chương IX. Quan hệ giữa các yếu tố trong một tam giác",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Định nghĩa đường trung trực và đường cao của tam giác.",
              "Tính chất đồng quy của 3 đường trung trực tại điểm O (cách đều ba đỉnh của tam giác, tâm đường tròn ngoại tiếp).",
              "Tính chất đồng quy của 3 đường cao tại điểm H gọi là Trực tâm của tam giác."
            ],
            understanding: [
              "Xác định vị trí trực tâm H và tâm O trong các tam giác nhọn, vuông, tù.",
              "Chứng minh tính chất trong tam giác cân: đường trung tuyến xuất phát từ đỉnh đồng thời là đường cao, đường trung trực, đường phân giác."
            ],
            application: [
              "Tìm vị trí khoan giếng chung cách đều 3 ngôi nhà trong khu dân cư."
            ]
          },
          keyConcepts: ["Đường trung trực", "Đường cao", "Trực tâm H", "Giao điểm ba đường trung trực cách đều ba đỉnh"]
        }
      ]
    },
    {
      id: "math7_c10",
      name: "Chương X. Một số hình khối trong thực tiễn",
      lessons: [
        {
          id: "m7_b36",
          lessonNumber: "Bài 36",
          name: "Bài 36. Hình hộp chữ nhật và hình lập phương",
          topicId: "math7_c10",
          topicName: "Chương X. Một số hình khối trong thực tiễn",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Mô tả các yếu tố của hình hộp chữ nhật và hình lập phương: 8 đỉnh, 12 cạnh, 6 mặt, 4 đường chéo.",
              "Công thức diện tích xung quanh (Sxq = 2(a+b)c hoặc 4a^2) và thể tích (V = a.b.c hoặc a^3)."
            ],
            understanding: [
              "Gấp và tạo lập hình hộp chữ nhật, hình lập phương từ hình khai triển.",
              "Tính diện tích xung quanh, diện tích toàn phần và thể tích trong bài toán thực tế."
            ],
            application: [
              "Tính thể tích bể nước hình hộp chữ nhật, diện tích sơn tường phòng học, chi phí làm hộp quà carton."
            ]
          },
          keyConcepts: ["Hình hộp chữ nhật", "Hình lập phương", "Đường chéo", "Sxq = 2(a+b)c", "V = abc", "V = a^3"]
        },
        {
          id: "m7_b37",
          lessonNumber: "Bài 37",
          name: "Bài 37. Hình lăng trụ đứng tam giác và hình lăng trụ đứng tứ giác",
          topicId: "math7_c10",
          topicName: "Chương X. Một số hình khối trong thực tiễn",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Mô tả các yếu tố cơ bản của hình lăng trụ đứng tam giác (tứ giác): hai mặt đáy song song và bằng nhau, các mặt bên là các hình chữ nhật, các cạnh bên song song và bằng nhau (chiều cao h).",
              "Công thức: Diện tích xung quanh Sxq = Cday . h; Thể tích V = Sday . h."
            ],
            understanding: [
              "Gấp và tạo lập mô hình hình lăng trụ đứng từ tấm bìa phẳng.",
              "Tính diện tích xung quanh và thể tích của hình lăng trụ đứng tam giác, tứ giác."
            ],
            application: [
              "Tính lượng vải bạt dựng lều chữ A, thể tích thanh chặn bánh xe hình thang, thể tích hộp bánh kem lăng trụ."
            ]
          },
          keyConcepts: ["Hình lăng trụ đứng tam giác", "Hình lăng trụ đứng tứ giác", "Mặt đáy", "Mặt bên hình chữ nhật", "Sxq = Cday . h", "V = Sday . h"]
        }
      ]
    }
  ]
};
