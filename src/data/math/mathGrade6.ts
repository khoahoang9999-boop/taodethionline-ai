import { TextbookGrade } from "../textbooks";

export const MATH_TEXTBOOK_GRADE_6: TextbookGrade = {
  grade: "6",
  bookSeries: "Kết nối tri thức với cuộc sống",
  title: "Toán học 6 - Bộ sách Kết nối tri thức với cuộc sống",
  description: "Chuẩn kiến thức, kĩ năng theo Chương trình GDPT 2018 môn Toán lớp 6",
  topics: [
    {
      id: "math6_c1",
      name: "Chương I. Tập hợp các số tự nhiên",
      lessons: [
        {
          id: "m6_b1",
          lessonNumber: "Bài 1",
          name: "Bài 1. Tập hợp",
          topicId: "math6_c1",
          topicName: "Chương I. Tập hợp các số tự nhiên",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được khái niệm tập hợp và các phần tử của tập hợp.",
              "Sử dụng đúng các kí hiệu thuộc (∈), không thuộc (∉)."
            ],
            understanding: [
              "Mô tả được một tập hợp bằng cách liệt kê các phần tử hoặc chỉ ra tính chất đặc trưng.",
              "Biểu diễn tập hợp bằng sơ đồ Venn đơn giản."
            ],
            application: [
              "Vận dụng tập hợp để biểu diễn các nhóm đối tượng cụ thể trong thực tế."
            ]
          },
          keyConcepts: ["Tập hợp", "Phần tử", "Kí hiệu ∈, ∉", "Liệt kê", "Tính chất đặc trưng"]
        },
        {
          id: "m6_b2",
          lessonNumber: "Bài 2",
          name: "Bài 2. Cách ghi số tự nhiên",
          topicId: "math6_c1",
          topicName: "Chương I. Tập hợp các số tự nhiên",
          periods: 1,
          learningOutcomes: {
            recognition: [
              "Nhận biết hệ thập phân và giá trị các chữ số theo vị trí.",
              "Nhận biết và đọc, viết được các chữ số La Mã từ 1 đến 30."
            ],
            understanding: [
              "Biểu diễn được một số tự nhiên thành tổng các hàng đơn vị, chục, trăm, nghìn...",
              "Chuyển đổi số tự nhiên viết bằng số La Mã và ngược lại."
            ],
            application: [
              "Ứng dụng chữ số La Mã để đọc số thế kỉ, số thứ tự trên đồng hồ, chương sách."
            ]
          },
          keyConcepts: ["Hệ thập phân", "Chữ số La Mã", "Giá trị vị trí"]
        },
        {
          id: "m6_b3",
          lessonNumber: "Bài 3",
          name: "Bài 3. Thứ tự trong tập hợp các số tự nhiên",
          topicId: "math6_c1",
          topicName: "Chương I. Tập hợp các số tự nhiên",
          periods: 1,
          learningOutcomes: {
            recognition: [
              "Biết biểu diễn các số tự nhiên trên tia số.",
              "Nhận biết thứ tự lớn hơn (>), nhỏ hơn (<), lớn hơn hoặc bằng (≥), nhỏ hơn hoặc bằng (≤)."
            ],
            understanding: [
              "So sánh được hai số tự nhiên bất kì và sắp xếp dãy số tự nhiên theo thứ tự tăng/giảm."
            ],
            application: [
              "So sánh các số liệu thống kê tự nhiên trong các bài toán thực tế đời sống."
            ]
          },
          keyConcepts: ["Tia số", "So sánh số tự nhiên", "Thứ tự"]
        },
        {
          id: "m6_b4",
          lessonNumber: "Bài 4",
          name: "Bài 4. Phép cộng và phép trừ số tự nhiên",
          topicId: "math6_c1",
          topicName: "Chương I. Tập hợp các số tự nhiên",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết các thành phần trong phép cộng và phép trừ số tự nhiên (số hạng, tổng, số bị trừ, số trừ, hiệu).",
              "Nêu được tính chất giao hoán, kết hợp của phép cộng."
            ],
            understanding: [
              "Thực hiện thành thạo phép cộng và phép trừ các số tự nhiên nhiều chữ số.",
              "Áp dụng tính chất giao hoán, kết hợp để tính nhẩm, tính nhanh một cách hợp lí."
            ],
            application: [
              "Giải quyết các bài toán thực tế liên quan đến chi phí, tiền tệ, số lượng đồ vật."
            ]
          },
          keyConcepts: ["Phép cộng", "Phép trừ", "Tính chất giao hoán", "Tính chất kết hợp", "Tính nhanh"]
        },
        {
          id: "m6_b5",
          lessonNumber: "Bài 5",
          name: "Bài 5. Phép nhân và phép chia số tự nhiên",
          topicId: "math6_c1",
          topicName: "Chương I. Tập hợp các số tự nhiên",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết các thành phần trong phép nhân và phép chia hết, phép chia có dư.",
              "Nêu tính chất giao hoán, kết hợp của phép nhân và tính chất phân phối giữa phép nhân với phép cộng."
            ],
            understanding: [
              "Thực hiện được phép nhân, chia có dư với điều kiện số dư luôn nhỏ hơn số chia (r < b).",
              "Vận dụng tính chất phân phối để tính nhanh và rút gọn biểu thức số."
            ],
            application: [
              "Giải các bài toán chia đều, xếp xe, mua sắm hàng hóa theo lô, tính toán chi tiêu."
            ]
          },
          keyConcepts: ["Phép nhân", "Phép chia có dư", "Tính chất phân phối", "Số dư r < b"]
        },
        {
          id: "m6_b6",
          lessonNumber: "Bài 6",
          name: "Bài 6. Lũy thừa với số mũ tự nhiên",
          topicId: "math6_c1",
          topicName: "Chương I. Tập hợp các số tự nhiên",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết định nghĩa lũy thừa a^n, cơ số và số mũ.",
              "Nhớ các quy tắc nhân, chia hai lũy thừa cùng cơ số: a^m . a^n = a^(m+n); a^m : a^n = a^(m-n) (a ≠ 0, m ≥ n)."
            ],
            understanding: [
              "Tính được giá trị của một lũy thừa với số mũ tự nhiên.",
              "Thực hiện thành thạo phép nhân và phép chia hai lũy thừa cùng cơ số."
            ],
            application: [
              "Biểu diễn các số rất lớn (như khoảng cách thiên văn, dân số) dưới dạng lũy thừa của 10."
            ]
          },
          keyConcepts: ["Lũy thừa", "Cơ số", "Số mũ", "Nhân chia cùng cơ số", "Lũy thừa của 10"]
        },
        {
          id: "m6_b7",
          lessonNumber: "Bài 7",
          name: "Bài 7. Thứ tự thực hiện các phép tính",
          topicId: "math6_c1",
          topicName: "Chương I. Tập hợp các số tự nhiên",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết quy tắc thứ tự thực hiện các phép tính: lũy thừa -> nhân chia -> cộng trừ.",
              "Nhận biết thứ tự ưu tiên các loại ngoặc tròn ( ), vuông [ ], nhọn { }."
            ],
            understanding: [
              "Tính đúng giá trị của biểu thức chứa nhiều phép toán và dấu ngoặc lồng nhau."
            ],
            application: [
              "Tìm số chưa biết x trong các bài toán tìm x có chứa biểu thức phức hợp."
            ]
          },
          keyConcepts: ["Thứ tự phép tính", "Biểu thức có ngoặc", "Tìm x"]
        }
      ]
    },
    {
      id: "math6_c2",
      name: "Chương II. Tính chia hết trong tập hợp các số tự nhiên",
      lessons: [
        {
          id: "m6_b8",
          lessonNumber: "Bài 8",
          name: "Bài 8. Quan hệ chia hết và tính chất",
          topicId: "math6_c2",
          topicName: "Chương II. Tính chia hết trong tập hợp các số tự nhiên",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết quan hệ chia hết a ⋮ b và kí hiệu chia hết, không chia hết.",
              "Nêu tính chất chia hết của một tổng/hiệu."
            ],
            understanding: [
              "Xét tính chia hết của một tổng hoặc một hiệu mà không cần tính cụ thể giá trị của tổng/hiệu."
            ],
            application: [
              "Vận dụng tính chất chia hết để giải các bài toán chứng minh chia hết và tìm số tự nhiên thỏa mãn điều kiện."
            ]
          },
          keyConcepts: ["Chia hết", "Tính chất chia hết của tổng", "Ước và bội"]
        },
        {
          id: "m6_b9",
          lessonNumber: "Bài 9",
          name: "Bài 9. Dấu hiệu chia hết",
          topicId: "math6_c2",
          topicName: "Chương II. Tính chia hết trong tập hợp các số tự nhiên",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết dấu hiệu chia hết cho 2, cho 5 (dựa vào chữ số tận cùng).",
              "Nhận biết dấu hiệu chia hết cho 3, cho 9 (dựa vào tổng các chữ số)."
            ],
            understanding: [
              "Giải thích tại sao một số chia hết hoặc không chia hết cho 2, 5, 3, 9.",
              "Tìm chữ số thích hợp điền vào dấu * để được số chia hết cho 2, 5, 3, 9."
            ],
            application: [
              "Phân loại các số chẵn, số lẻ và phối hợp các dấu hiệu để giải quyết bài toán thực tế và cấu tạo số."
            ]
          },
          keyConcepts: ["Dấu hiệu chia hết cho 2, 5", "Dấu hiệu chia hết cho 3, 9", "Số chẵn", "Số lẻ", "Tổng các chữ số"]
        },
        {
          id: "m6_b10",
          lessonNumber: "Bài 10",
          name: "Bài 10. Số nguyên tố",
          topicId: "math6_c2",
          topicName: "Chương II. Tính chia hết trong tập hợp các số tự nhiên",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết định nghĩa số nguyên tố, hợp số và số 0, số 1.",
              "Nhớ bảng các số nguyên tố nhỏ hơn 100."
            ],
            understanding: [
              "Phân tích được một hợp số ra thừa số nguyên tố bằng sơ đồ cột hoặc sơ đồ cây."
            ],
            application: [
              "Vận dụng phân tích thừa số nguyên tố để xác định số lượng ước số của một số tự nhiên."
            ]
          },
          keyConcepts: ["Số nguyên tố", "Hợp số", "Phân tích ra thừa số nguyên tố"]
        },
        {
          id: "m6_b11",
          lessonNumber: "Bài 11",
          name: "Bài 11. Ước chung. Ước chung lớn nhất",
          topicId: "math6_c2",
          topicName: "Chương II. Tính chia hết trong tập hợp các số tự nhiên",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết khái niệm ước chung (ƯC) và ước chung lớn nhất (ƯCLN).",
              "Khái niệm hai số nguyên tố cùng nhau."
            ],
            understanding: [
              "Tìm được ƯCLN của hai hay nhiều số bằng cách phân tích ra thừa số nguyên tố.",
              "Rút gọn phân số về phân số tối giản nhờ ƯCLN."
            ],
            application: [
              "Giải các bài toán thực tế về chia đều quà, phân phối đội hình, chia tổ học tập."
            ]
          },
          keyConcepts: ["Ước chung", "ƯCLN", "Nguyên tố cùng nhau", "Rút gọn phân số tối giản"]
        },
        {
          id: "m6_b12",
          lessonNumber: "Bài 12",
          name: "Bài 12. Bội chung. Bội chung nhỏ nhất",
          topicId: "math6_c2",
          topicName: "Chương II. Tính chia hết trong tập hợp các số tự nhiên",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết khái niệm bội chung (BC) và bội chung nhỏ nhất (BCNN)."
            ],
            understanding: [
              "Tìm được BCNN của hai hay nhiều số bằng phương pháp phân tích ra thừa số nguyên tố.",
              "Quy đồng mẫu số các phân số dựa vào BCNN của các mẫu."
            ],
            application: [
              "Giải các bài toán về chu kì gặp nhau, thời gian lặp lại của tín hiệu đèn giao thông, chuyến xe buýt."
            ]
          },
          keyConcepts: ["Bội chung", "BCNN", "Quy đồng mẫu số", "Bài toán chu kì"]
        }
      ]
    },
    {
      id: "math6_c3",
      name: "Chương III. Số nguyên",
      lessons: [
        {
          id: "m6_b13",
          lessonNumber: "Bài 13",
          name: "Bài 13. Tập hợp các số nguyên",
          topicId: "math6_c3",
          topicName: "Chương III. Số nguyên",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết số nguyên âm, số nguyên dương, số 0 và tập hợp số nguyên Z.",
              "Biết biểu diễn số nguyên trên trục số nằm ngang và thẳng đứng."
            ],
            understanding: [
              "Tìm được số đối của một số nguyên.",
              "So sánh được hai số nguyên bất kì."
            ],
            application: [
              "Sử dụng số nguyên để mô tả độ cao dưới mực nước biển, nhiệt độ dưới 0°C, số tiền nợ/lời trong kinh doanh."
            ]
          },
          keyConcepts: ["Số nguyên âm", "Tập hợp Z", "Trục số", "Số đối", "So sánh số nguyên"]
        },
        {
          id: "m6_b14",
          lessonNumber: "Bài 14",
          name: "Bài 14. Phép cộng và phép trừ số nguyên",
          topicId: "math6_c3",
          topicName: "Chương III. Số nguyên",
          periods: 4,
          learningOutcomes: {
            recognition: [
              "Nắm vững quy tắc cộng hai số nguyên cùng dấu, khác dấu.",
              "Quy tắc chuyển phép trừ sang phép cộng với số đối: a - b = a + (-b)."
            ],
            understanding: [
              "Thực hiện thành thạo phép cộng và phép trừ các số nguyên.",
              "Vận dụng tính chất giao hoán, kết hợp của phép cộng số nguyên để tính hợp lí."
            ],
            application: [
              "Tính toán nhiệt độ thay đổi, biến động tài khoản ngân hàng, độ chênh lệch độ cao địa hình."
            ]
          },
          keyConcepts: ["Cộng cùng dấu", "Cộng khác dấu", "Trừ số nguyên", "Cộng với số đối"]
        },
        {
          id: "m6_b15",
          lessonNumber: "Bài 15",
          name: "Bài 15. Quy tắc dấu ngoặc",
          topicId: "math6_c3",
          topicName: "Chương III. Số nguyên",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết quy tắc bỏ dấu ngoặc có dấu '+' hoặc dấu '-' đằng trước."
            ],
            understanding: [
              "Bỏ dấu ngoặc hoặc đặt các số hạng vào trong dấu ngoặc có dấu '+' hoặc '-' một cách chính xác.",
              "Tính nhanh giá trị biểu thức số nguyên."
            ],
            application: [
              "Rút gọn và giải các phương trình tìm số nguyên x có chứa dấu ngoặc."
            ]
          },
          keyConcepts: ["Quy tắc dấu ngoặc", "Đổi dấu khi có dấu '-' trước ngoặc", "Tính nhanh"]
        },
        {
          id: "m6_b16",
          lessonNumber: "Bài 16",
          name: "Bài 16. Phép nhân số nguyên",
          topicId: "math6_c3",
          topicName: "Chương III. Số nguyên",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết quy tắc nhân hai số nguyên cùng dấu (dương), khác dấu (âm).",
              "Nhớ quy tắc xét dấu của tích nhiều số nguyên."
            ],
            understanding: [
              "Thực hiện được phép nhân các số nguyên và vận dụng tính chất phân phối của phép nhân đối với phép cộng."
            ],
            application: [
              "Tính lũy thừa với cơ số nguyên âm và giải quyết bài toán liên quan đến chuyển động, nợ/lãi lũy kế."
            ]
          },
          keyConcepts: ["Nhân hai số nguyên", "Quy tắc dấu", "Lũy thừa cơ số âm", "Tính chất phân phối"]
        },
        {
          id: "m6_b17",
          lessonNumber: "Bài 17",
          name: "Bài 17. Phép chia hết. Ước và bội của một số nguyên",
          topicId: "math6_c3",
          topicName: "Chương III. Số nguyên",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết khái niệm quan hệ chia hết trong Z.",
              "Biết tìm tập hợp các ước và bội của một số nguyên bất kì."
            ],
            understanding: [
              "Hiểu và áp dụng các tính chất chia hết trong tập hợp số nguyên."
            ],
            application: [
              "Tìm số nguyên x thỏa mãn điều kiện chia hết (ví dụ: (x + 2) là ước của 6)."
            ]
          },
          keyConcepts: ["Ước của số nguyên", "Bội của số nguyên", "Chia hết trong Z"]
        }
      ]
    },
    {
      id: "math6_c4",
      name: "Chương IV. Một số hình phẳng trong thực tiễn",
      lessons: [
        {
          id: "m6_b18",
          lessonNumber: "Bài 18",
          name: "Bài 18. Hình tam giác đều. Hình vuông. Hình lục giác đều",
          topicId: "math6_c4",
          topicName: "Chương IV. Một số hình phẳng trong thực tiễn",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết hình tam giác đều, hình vuông, hình lục giác đều qua hình dạng thực tế.",
              "Nêu các đặc điểm về cạnh, góc của từng hình."
            ],
            understanding: [
              "Vẽ được tam giác đều, hình vuông bằng thước và compa hoặc ê-ke."
            ],
            application: [
              "Nhận diện các họa tiết trang trí, gạch lát sàn, tổ ong có dạng hình học đều."
            ]
          },
          keyConcepts: ["Hình tam giác đều", "Hình vuông", "Hình lục giác đều", "Vẽ hình"]
        },
        {
          id: "m6_b19",
          lessonNumber: "Bài 19",
          name: "Bài 19. Hình chữ nhật. Hình thoi. Hình bình hành. Hình thang cân",
          topicId: "math6_c4",
          topicName: "Chương IV. Một số hình phẳng trong thực tiễn",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết hình chữ nhật, hình thoi, hình bình hành, hình thang cân và các yếu tố cạnh, góc, đường chéo."
            ],
            understanding: [
              "Phân biệt và vẽ được các hình tứ giác đã học bằng dụng cụ hình học."
            ],
            application: [
              "Quan sát các vật thể kiến trúc, khung cửa sổ, mái nhà, diều có dạng tứ giác."
            ]
          },
          keyConcepts: ["Hình chữ nhật", "Hình thoi", "Hình bình hành", "Hình thang cân", "Đường chéo"]
        },
        {
          id: "m6_b20",
          lessonNumber: "Bài 20",
          name: "Bài 20. Chu vi và diện tích của một số tứ giác đã học",
          topicId: "math6_c4",
          topicName: "Chương IV. Một số hình phẳng trong thực tiễn",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhớ công thức tính chu vi và diện tích: hình chữ nhật, hình vuông, hình thang, hình bình hành, hình thoi."
            ],
            understanding: [
              "Tính diện tích và chu vi của các hình khi biết đầy đủ các kích thước tương ứng."
            ],
            application: [
              "Tính toán chi phí lát gạch sàn nhà, trồng cỏ sân vườn, làm hàng rào bao quanh mảnh đất đa giác."
            ]
          },
          keyConcepts: ["Công thức diện tích", "Công thức chu vi", "Hình chữ nhật, thoi, thang, bình hành"]
        }
      ]
    },
    {
      id: "math6_c5",
      name: "Chương V. Tính đối xứng của hình phẳng trong tự nhiên",
      lessons: [
        {
          id: "m6_b21",
          lessonNumber: "Bài 21",
          name: "Bài 21. Hình có trục đối xứng",
          topicId: "math6_c5",
          topicName: "Chương V. Tính đối xứng của hình phẳng trong tự nhiên",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết trục đối xứng và hình có trục đối xứng trong thực tế (lá cây, con bướm, tháp Rùa).",
              "Nhận biết hình có một, hai hoặc vô số trục đối xứng."
            ],
            understanding: [
              "Xác định được trục đối xứng của các hình học quen thuộc (đoạn thẳng, góc, tam giác cân, hình vuông, tròn)."
            ],
            application: [
              "Gấp và cắt giấy tạo hình có trục đối xứng, nhận biết các công trình kiến trúc đối xứng."
            ]
          },
          keyConcepts: ["Trục đối xứng", "Hình có trục đối xứng", "Gấp giấy"]
        },
        {
          id: "m6_b22",
          lessonNumber: "Bài 22",
          name: "Bài 22. Hình có tâm đối xứng",
          topicId: "math6_c5",
          topicName: "Chương V. Tính đối xứng của hình phẳng trong tự nhiên",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết tâm đối xứng và hình có tâm đối xứng (hoa chanh, cánh quạt, cỏ bốn lá, chữ N, S)."
            ],
            understanding: [
              "Xác định tâm đối xứng của các hình học phẳng quen thuộc (hình bình hành, hình thoi, hình chữ nhật, hình tròn)."
            ],
            application: [
              "Ứng dụng tính đối xứng tâm trong thiết kế logo, biểu trưng nghệ thuật."
            ]
          },
          keyConcepts: ["Tâm đối xứng", "Hình có tâm đối xứng", "Logo đối xứng"]
        }
      ]
    },
    {
      id: "math6_c6",
      name: "Chương VI. Phân số",
      lessons: [
        {
          id: "m6_b23",
          lessonNumber: "Bài 23",
          name: "Bài 23. Mở rộng phân số. Phân số bằng nhau",
          topicId: "math6_c6",
          topicName: "Chương VI. Phân số",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết phân số a/b với a, b ∈ Z (b ≠ 0).",
              "Nhận biết điều kiện để hai phân số bằng nhau: a/b = c/d khi a.d = b.c."
            ],
            understanding: [
              "Vận dụng tính chất cơ bản của phân số để rút gọn và quy đồng mẫu số nhiều phân số.",
              "Viết một số nguyên dưới dạng phân số."
            ],
            application: [
              "Tìm số nguyên x, y thỏa mãn đẳng thức hai phân số bằng nhau."
            ]
          },
          keyConcepts: ["Phân số a/b", "Phân số bằng nhau", "Tính chất cơ bản của phân số", "Rút gọn phân số tối giản"]
        },
        {
          id: "m6_b24",
          lessonNumber: "Bài 24",
          name: "Bài 24. So sánh phân số. Hỗn số dương",
          topicId: "math6_c6",
          topicName: "Chương VI. Phân số",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nắm quy tắc so sánh hai phân số cùng mẫu, khác mẫu.",
              "Nhận biết hỗn số dương gồm phần nguyên và phần phân số."
            ],
            understanding: [
              "Quy đồng mẫu để so sánh phân số hoặc so sánh qua phân số trung gian (0 hoặc 1).",
              "Chuyển đổi phân số lớn hơn 1 thành hỗn số dương và ngược lại."
            ],
            application: [
              "Sắp xếp thứ tự các số đo dung tích, khối lượng dưới dạng phân số trong thực tế."
            ]
          },
          keyConcepts: ["So sánh phân số", "Hỗn số dương", "Phần nguyên", "Phần phân số", "Phân số trung gian"]
        },
        {
          id: "m6_b25",
          lessonNumber: "Bài 25",
          name: "Bài 25. Phép cộng và phép trừ phân số",
          topicId: "math6_c6",
          topicName: "Chương VI. Phân số",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nêu được quy tắc cộng, trừ hai phân số cùng mẫu và khác mẫu.",
              "Nhận biết số đối của một phân số: -(a/b) = (-a)/b = a/(-b)."
            ],
            understanding: [
              "Thực hiện thành thạo phép cộng và phép trừ các phân số.",
              "Áp dụng tính chất giao hoán, kết hợp và quy tắc dấu ngoặc để tính nhanh hợp lí."
            ],
            application: [
              "Giải quyết các bài toán thực tế về thời gian làm việc chung, chia phần bánh, trộn nguyên liệu."
            ]
          },
          keyConcepts: ["Cộng phân số", "Trừ phân số", "Số đối", "Tính nhanh phân số"]
        },
        {
          id: "m6_b26",
          lessonNumber: "Bài 26",
          name: "Bài 26. Phép nhân và phép chia phân số",
          topicId: "math6_c6",
          topicName: "Chương VI. Phân số",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nắm quy tắc nhân hai phân số: a/b . c/d = (a.c)/(b.d).",
              "Nhận biết phân số nghịch đảo và quy tắc chia phân số."
            ],
            understanding: [
              "Thực hiện phép nhân và chia phân số, tính chất phân phối của phép nhân đối với phép cộng."
            ],
            application: [
              "Tính diện tích hình chữ nhật, vận tốc chuyển động khi các số đo là phân số."
            ]
          },
          keyConcepts: ["Nhân phân số", "Phân số nghịch đảo", "Chia phân số", "Tính chất phân phối"]
        },
        {
          id: "m6_b27",
          lessonNumber: "Bài 27",
          name: "Bài 27. Hai bài toán về phân số",
          topicId: "math6_c6",
          topicName: "Chương VI. Phân số",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết bài toán 1: Tìm giá trị phân số m/n của một số a cho trước (lấy a . m/n).",
              "Nhận biết bài toán 2: Tìm một số biết giá trị phân số m/n của nó bằng b (lấy b : m/n)."
            ],
            understanding: [
              "Phân biệt rõ ràng hai dạng bài toán và lựa chọn đúng phép tính nhân hoặc chia."
            ],
            application: [
              "Giải các bài toán thực tế: tính tiền giảm giá khuyến mãi, tính lượng nước trong bể, tỉ lệ đậu học sinh giỏi."
            ]
          },
          keyConcepts: ["Giá trị phân số của một số", "Tìm một số biết giá trị phân số", "Toán đố phân số"]
        }
      ]
    },
    {
      id: "math6_c7",
      name: "Chương VII. Số thập phân",
      lessons: [
        {
          id: "m6_b28",
          lessonNumber: "Bài 28",
          name: "Bài 28. Số thập phân",
          topicId: "math6_c7",
          topicName: "Chương VII. Số thập phân",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết số thập phân âm và số thập phân dương, phần số nguyên và phần thập phân.",
              "Nhận biết số đối của một số thập phân."
            ],
            understanding: [
              "Viết phân số thập phân thành số thập phân và ngược lại.",
              "So sánh hai số thập phân bất kì."
            ],
            application: [
              "Đọc các chỉ số hiển thị điện tử (nhiệt kế, cân điện tử, đồng hồ đo áp suất)."
            ]
          },
          keyConcepts: ["Số thập phân", "Phân số thập phân", "So sánh số thập phân"]
        },
        {
          id: "m6_b29",
          lessonNumber: "Bài 29",
          name: "Bài 29. Tính toán với số thập phân",
          topicId: "math6_c7",
          topicName: "Chương VII. Số thập phân",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhớ các quy tắc thực hiện phép cộng, trừ, nhân, chia số thập phân có dấu."
            ],
            understanding: [
              "Thực hiện thành thạo 4 phép tính với số thập phân có kèm quy tắc dấu ngoặc."
            ],
            application: [
              "Tính tiền hóa đơn điện nước, tính tiền tệ quy đổi ngoại tệ, tính vận tốc trung bình."
            ]
          },
          keyConcepts: ["Cộng trừ số thập phân", "Nhân chia số thập phân", "Tính giá trị biểu thức"]
        },
        {
          id: "m6_b30",
          lessonNumber: "Bài 30",
          name: "Bài 30. Làm tròn và ước lượng",
          topicId: "math6_c7",
          topicName: "Chương VII. Số thập phân",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nắm vững quy tắc làm tròn số thập phân đến một hàng cho trước (hàng chục, đơn vị, phần mười, phần trăm...)."
            ],
            understanding: [
              "Làm tròn số đúng theo quy tắc và ước lượng kết quả của các phép tính phức tạp."
            ],
            application: [
              "Ước lượng tổng chi phí mua sắm trong siêu thị trước khi thanh toán."
            ]
          },
          keyConcepts: ["Quy tắc làm tròn", "Ước lượng kết quả", "Độ chính xác"]
        },
        {
          id: "m6_b31",
          lessonNumber: "Bài 31",
          name: "Bài 31. Một số bài toán về tỉ số và tỉ số phần trăm",
          topicId: "math6_c7",
          topicName: "Chương VII. Số thập phân",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Hiểu khái niệm tỉ số của hai số a và b (b ≠ 0) và tỉ số phần trăm a/b . 100%."
            ],
            understanding: [
              "Tính tỉ số phần trăm của hai số, tìm giá trị phần trăm của một số và tìm một số khi biết giá trị phần trăm của nó."
            ],
            application: [
              "Tính lãi suất ngân hàng, thuế VAT, tỉ lệ giảm giá phần trăm khuyến mãi mùa lễ hội."
            ]
          },
          keyConcepts: ["Tỉ số", "Tỉ số phần trăm", "Lãi suất", "Khuyến mãi"]
        }
      ]
    },
    {
      id: "math6_c8",
      name: "Chương VIII. Những hình hình học cơ bản",
      lessons: [
        {
          id: "m6_b32",
          lessonNumber: "Bài 32",
          name: "Bài 32. Điểm và đường thẳng",
          topicId: "math6_c8",
          topicName: "Chương VIII. Những hình hình học cơ bản",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết điểm, đường thẳng, điểm thuộc đường thẳng, điểm không thuộc đường thẳng.",
              "Nhận biết ba điểm thẳng hàng, ba điểm không thẳng hàng."
            ],
            understanding: [
              "Vẽ điểm, đường thẳng đi qua hai điểm phân biệt, nhận biết hai đường thẳng cắt nhau, song song."
            ],
            application: [
              "Kiểm tra tính thẳng hàng của các cọc tiêu trong đo đạc thực tế."
            ]
          },
          keyConcepts: ["Điểm", "Đường thẳng", "Điểm thuộc đường thẳng", "Ba điểm thẳng hàng", "Đường thẳng song song", "Đường thẳng cắt nhau"]
        },
        {
          id: "m6_b33",
          lessonNumber: "Bài 33",
          name: "Bài 33. Điểm nằm giữa hai điểm. Tia",
          topicId: "math6_c8",
          topicName: "Chương VIII. Những hình hình học cơ bản",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết khái niệm điểm nằm giữa hai điểm.",
              "Nhận biết khái niệm tia, gốc của tia, hai tia đối nhau, hai tia trùng nhau."
            ],
            understanding: [
              "Vẽ tia Ox, xác định hai tia đối nhau trên cùng một đường thẳng.",
              "Xác định vị trí tương đối giữa các điểm trên một tia hoặc đường thẳng."
            ],
            application: [
              "Mô tả tia sáng, hướng chuyển động của vật thể."
            ]
          },
          keyConcepts: ["Điểm nằm giữa", "Tia", "Gốc của tia", "Hai tia đối nhau", "Hai tia trùng nhau"]
        },
        {
          id: "m6_b34",
          lessonNumber: "Bài 34",
          name: "Bài 34. Đoạn thẳng. Độ dài đoạn thẳng",
          topicId: "math6_c8",
          topicName: "Chương VIII. Những hình hình học cơ bản",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết khái niệm đoạn thẳng AB (gồm hai điểm A, B và tất cả các điểm nằm giữa A và B).",
              "Khái niệm độ dài đoạn thẳng và đơn vị đo."
            ],
            understanding: [
              "Sử dụng thước đo để xác định độ dài đoạn thẳng và so sánh độ dài hai đoạn thẳng.",
              "Nhận biết tính chất: Nếu điểm M nằm giữa A và B thì AM + MB = AB."
            ],
            application: [
              "Đo khoảng cách kích thước bàn học, sân trường thực tế."
            ]
          },
          keyConcepts: ["Đoạn thẳng", "Độ dài đoạn thẳng", "Điểm nằm giữa", "AM + MB = AB"]
        },
        {
          id: "m6_b35",
          lessonNumber: "Bài 35",
          name: "Bài 35. Trung điểm của đoạn thẳng",
          topicId: "math6_c8",
          topicName: "Chương VIII. Những hình hình học cơ bản",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết khái niệm trung điểm M của đoạn thẳng AB (M nằm giữa A, B và MA = MB = AB/2)."
            ],
            understanding: [
              "Xác định và vẽ trung điểm của một đoạn thẳng bằng thước đo hoặc gấp giấy."
            ],
            application: [
              "Xác định điểm chính giữa thanh xà, chia đôi dây nối, vị trí cân bằng đòn bẩy."
            ]
          },
          keyConcepts: ["Trung điểm đoạn thẳng", "Cách đều hai đầu mút", "Vẽ trung điểm"]
        },
        {
          id: "m6_b36",
          lessonNumber: "Bài 36",
          name: "Bài 36. Góc",
          topicId: "math6_c8",
          topicName: "Chương VIII. Những hình hình học cơ bản",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết góc là hình tạo bởi hai tia chung gốc.",
              "Xác định đỉnh, cạnh của góc, kí hiệu góc và điểm nằm trong góc."
            ],
            understanding: [
              "Vẽ góc xOy, đọc tên góc theo các cách khác nhau (góc xOy, góc yOx, góc O)."
            ],
            application: [
              "Nhận diện các góc tạo bởi các cạnh của đồ vật, cánh cửa, compa."
            ]
          },
          keyConcepts: ["Góc", "Đỉnh của góc", "Cạnh của góc", "Điểm nằm trong góc"]
        },
        {
          id: "m6_b37",
          lessonNumber: "Bài 37",
          name: "Bài 37. Số đo góc",
          topicId: "math6_c8",
          topicName: "Chương VIII. Những hình hình học cơ bản",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết dụng cụ đo góc (thước đo góc), đơn vị đo độ (°).",
              "Phân loại các góc: góc nhọn (<90°), góc vuông (=90°), góc tù (>90° và <180°), góc bẹt (=180°)."
            ],
            understanding: [
              "Đo góc bằng thước đo góc chính xác và so sánh hai góc."
            ],
            application: [
              "Đo góc mở của cánh cửa, góc nghiêng của mái nhà, góc tạo bởi hai kim đồng hồ."
            ]
          },
          keyConcepts: ["Thước đo góc", "Số đo góc", "Góc vuông", "Góc nhọn", "Góc tù", "Góc bẹt"]
        }
      ]
    },
    {
      id: "math6_c9",
      name: "Chương IX. Dữ liệu và xác suất thực nghiệm",
      lessons: [
        {
          id: "m6_b38",
          lessonNumber: "Bài 38",
          name: "Bài 38. Dữ liệu và thu thập dữ liệu",
          topicId: "math6_c9",
          topicName: "Chương IX. Dữ liệu và xác suất thực nghiệm",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết dữ liệu là số liệu hay dữ liệu không là số (danh từ, phân loại).",
              "Nhận biết tính đại diện và hợp lí của dữ liệu."
            ],
            understanding: [
              "Thu thập dữ liệu qua quan sát, phiếu hỏi, phỏng vấn hoặc tra cứu tài liệu."
            ],
            application: [
              "Thực hiện khảo sát sở thích món ăn, môn thể thao yêu thích của các bạn trong lớp."
            ]
          },
          keyConcepts: ["Dữ liệu", "Thu thập dữ liệu", "Số liệu", "Dữ liệu không là số"]
        },
        {
          id: "m6_b39",
          lessonNumber: "Bài 39",
          name: "Bài 39. Bảng thống kê và biểu đồ tranh",
          topicId: "math6_c9",
          topicName: "Chương IX. Dữ liệu và xác suất thực nghiệm",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết cấu tạo của bảng thống kê và biểu đồ tranh (biểu tượng đại diện)."
            ],
            understanding: [
              "Đọc và lập bảng thống kê từ dữ liệu thô.",
              "Vẽ và diễn giải thông tin từ biểu đồ tranh."
            ],
            application: [
              "Thống kê số lượng cây trồng của từng tổ, số điểm tốt của các bạn."
            ]
          },
          keyConcepts: ["Bảng thống kê", "Biểu đồ tranh", "Biểu tượng"]
        },
        {
          id: "m6_b40",
          lessonNumber: "Bài 40",
          name: "Bài 40. Biểu đồ cột",
          topicId: "math6_c9",
          topicName: "Chương IX. Dữ liệu và xác suất thực nghiệm",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết biểu đồ cột, trục ngang, trục đứng, cột biểu diễn và số liệu tương ứng."
            ],
            understanding: [
              "Đọc và vẽ biểu đồ cột từ bảng số liệu cho trước.",
              "So sánh các cột số liệu để rút ra nhận xét thống kê."
            ],
            application: [
              "Đọc báo cáo số lượng học sinh khá giỏi qua các năm, doanh thu bán hoa quả."
            ]
          },
          keyConcepts: ["Biểu đồ cột", "Trục ngang", "Trục đứng", "Vẽ biểu đồ cột"]
        },
        {
          id: "m6_b41",
          lessonNumber: "Bài 41",
          name: "Bài 41. Biểu đồ cột kép",
          topicId: "math6_c9",
          topicName: "Chương IX. Dữ liệu và xác suất thực nghiệm",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết biểu đồ cột kép (gồm các cặp cột biểu diễn hai nhóm đối tượng so sánh song song)."
            ],
            understanding: [
              "Đọc và vẽ biểu đồ cột kép biểu diễn bảng số liệu có hai tiêu chí so sánh.",
              "Phân tích, so sánh sự khác biệt và xu hướng giữa hai nhóm đối tượng."
            ],
            application: [
              "So sánh số lượng học sinh nam/nữ giữa các lớp hoặc doanh số bán hàng quý I và quý II."
            ]
          },
          keyConcepts: ["Biểu đồ cột kép", "Cặp cột so sánh", "Đọc và vẽ biểu đồ kép"]
        },
        {
          id: "m6_b42",
          lessonNumber: "Bài 42",
          name: "Bài 42. Kết quả có thể và sự kiện trong trò chơi, thí nghiệm",
          topicId: "math6_c9",
          topicName: "Chương IX. Dữ liệu và xác suất thực nghiệm",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Liệt kê được tất cả các kết quả có thể xảy ra trong một trò chơi, thí nghiệm đơn giản (tung đồng xu, gieo xúc xắc, lấy bóng trong hộp)."
            ],
            understanding: [
              "Nhận biết sự kiện xảy ra hoặc không xảy ra tương ứng với các kết quả cụ thể."
            ],
            application: [
              "Dự đoán kết quả trong các trò chơi bốc thăm trúng thưởng dân gian."
            ]
          },
          keyConcepts: ["Kết quả có thể", "Sự kiện", "Tung đồng xu", "Gieo xúc xắc"]
        },
        {
          id: "m6_b43",
          lessonNumber: "Bài 43",
          name: "Bài 43. Xác suất thực nghiệm",
          topicId: "math6_c9",
          topicName: "Chương IX. Dữ liệu và xác suất thực nghiệm",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nắm công thức tính xác suất thực nghiệm: k/n (k: số lần sự kiện xảy ra, n: tổng số lần thực hiện thí nghiệm)."
            ],
            understanding: [
              "Tính xác suất thực nghiệm của một sự kiện sau một chuỗi các phép thử lặp lại nhiều lần."
            ],
            application: [
              "Đánh giá tỉ lệ chiến thắng trong trò chơi gieo xúc xắc hoặc tỉ lệ xạ thủ bắn trúng bia."
            ]
          },
          keyConcepts: ["Xác suất thực nghiệm", "Công thức k/n", "Tần số xuất hiện"]
        }
      ]
    }
  ]
};
