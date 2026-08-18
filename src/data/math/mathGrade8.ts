import { TextbookGrade } from "../textbooks";

export const MATH_TEXTBOOK_GRADE_8: TextbookGrade = {
  grade: "8",
  bookSeries: "Kết nối tri thức với cuộc sống",
  title: "Toán học 8 - Bộ sách Kết nối tri thức với cuộc sống",
  description: "Chuẩn kiến thức, kĩ năng theo Chương trình GDPT 2018 môn Toán lớp 8 (Tập 1 & Tập 2)",
  topics: [
    {
      id: "math8_c1",
      name: "Chương I. Đa thức",
      lessons: [
        {
          id: "m8_b1",
          lessonNumber: "Bài 1",
          name: "Bài 1. Đơn thức",
          topicId: "math8_c1",
          topicName: "Chương I. Đa thức",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết đơn thức, đơn thức thu gọn, hệ số, phần biến và bậc của đơn thức.",
              "Nhận biết hai đơn thức đồng dạng."
            ],
            understanding: [
              "Thu gọn đơn thức và xác định bậc của đơn thức.",
              "Thực hiện phép cộng và trừ hai đơn thức đồng dạng."
            ],
            application: [
              "Tính giá trị của đơn thức tại các giá trị cho trước của biến."
            ]
          },
          keyConcepts: ["Đơn thức", "Đơn thức thu gọn", "Hệ số", "Phần biến", "Bậc của đơn thức", "Đơn thức đồng dạng"]
        },
        {
          id: "m8_b2",
          lessonNumber: "Bài 2",
          name: "Bài 2. Đa thức",
          topicId: "math8_c1",
          topicName: "Chương I. Đa thức",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết đa thức là tổng của những đơn thức, các hạng tử của đa thức.",
              "Khái niệm đa thức thu gọn và bậc của đa thức."
            ],
            understanding: [
              "Thu gọn đa thức bằng cách nhóm các hạng tử đồng dạng và xác định bậc của đa thức.",
              "Tính giá trị của đa thức khi biết giá trị của các biến."
            ],
            application: [
              "Viết biểu thức đa thức biểu thị diện tích, chi phí mua hàng trong thực tế."
            ]
          },
          keyConcepts: ["Đa thức", "Hạng tử", "Đa thức thu gọn", "Bậc của đa thức", "Giá trị đa thức"]
        },
        {
          id: "m8_b3",
          lessonNumber: "Bài 3",
          name: "Bài 3. Phép cộng và phép trừ đa thức",
          topicId: "math8_c1",
          topicName: "Chương I. Đa thức",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nắm quy tắc cộng, trừ hai đa thức (bỏ ngoặc, nhóm các hạng tử đồng dạng và thu gọn)."
            ],
            understanding: [
              "Thực hiện thành thạo phép cộng và phép trừ các đa thức nhiều biến.",
              "Vận dụng tính chất giao hoán, kết hợp của phép cộng đa thức."
            ],
            application: [
              "Rút gọn biểu thức tổng/hiệu đa thức trong các bài toán hình học và thực tế."
            ]
          },
          keyConcepts: ["Cộng đa thức", "Trừ đa thức", "Bỏ dấu ngoặc", "Nhóm hạng tử đồng dạng"]
        },
        {
          id: "m8_b4",
          lessonNumber: "Bài 4",
          name: "Bài 4. Phép nhân đa thức",
          topicId: "math8_c1",
          topicName: "Chương I. Đa thức",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nắm quy tắc nhân đơn thức với đơn thức, nhân đơn thức với đa thức.",
              "Nắm quy tắc nhân đa thức với đa thức."
            ],
            understanding: [
              "Thực hiện thành thạo các phép nhân đa thức nhiều biến.",
              "Rút gọn biểu thức có chứa tích các đa thức."
            ],
            application: [
              "Tính thể tích hình hộp chữ nhật có các kích thước là biểu thức chứa biến."
            ]
          },
          keyConcepts: ["Nhân đơn thức với đa thức", "Nhân đa thức với đa thức", "Rút gọn biểu thức"]
        },
        {
          id: "m8_b5",
          lessonNumber: "Bài 5",
          name: "Bài 5. Phép chia đa thức cho đơn thức",
          topicId: "math8_c1",
          topicName: "Chương I. Đa thức",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết điều kiện để đơn thức A chia hết cho đơn thức B.",
              "Quy tắc chia đơn thức cho đơn thức và chia đa thức cho đơn thức."
            ],
            understanding: [
              "Thực hiện thành thạo phép chia đa thức cho đơn thức khi mọi hạng tử đều chia hết."
            ],
            application: [
              "Tính chiều cao của khối hộp khi biết thể tích và diện tích đáy."
            ]
          },
          keyConcepts: ["Chia đơn thức cho đơn thức", "Chia đa thức cho đơn thức", "Điều kiện chia hết"]
        }
      ]
    },
    {
      id: "math8_c2",
      name: "Chương II. Hằng đẳng thức đáng nhớ và ứng dụng",
      lessons: [
        {
          id: "m8_b6",
          lessonNumber: "Bài 6",
          name: "Bài 6. Hiệu hai bình phương. Bình phương của một tổng hay một hiệu",
          topicId: "math8_c2",
          topicName: "Chương II. Hằng đẳng thức đáng nhớ và ứng dụng",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhớ và phát biểu 3 hằng đẳng thức đầu tiên: A^2 - B^2 = (A-B)(A+B); (A+B)^2 = A^2 + 2AB + B^2; (A-B)^2 = A^2 - 2AB + B^2."
            ],
            understanding: [
              "Khai triển hoặc viết gọn biểu thức về dạng bình phương một tổng, bình phương một hiệu hoặc hiệu hai bình phương.",
              "Tính nhanh nhẩm bình phương các số (ví dụ: 101^2, 99^2, 1002^2)."
            ],
            application: [
              "Chứng minh bất đẳng thức đơn giản và tính nhanh giá trị biểu thức."
            ]
          },
          keyConcepts: ["Hiệu hai bình phương", "Bình phương của một tổng", "Bình phương của một hiệu", "Tính nhanh"]
        },
        {
          id: "m8_b7",
          lessonNumber: "Bài 7",
          name: "Bài 7. Lập phương của một tổng hay một hiệu",
          topicId: "math8_c2",
          topicName: "Chương II. Hằng đẳng thức đáng nhớ và ứng dụng",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhớ và phát biểu 2 hằng đẳng thức: (A+B)^3 = A^3 + 3A^2B + 3AB^2 + B^3; (A-B)^3 = A^3 - 3A^2B + 3AB^2 - B^3."
            ],
            understanding: [
              "Khai triển hằng đẳng thức lập phương một tổng/hiệu và thu gọn biểu thức."
            ],
            application: [
              "Tính nhanh giá trị biểu thức tại các giá trị của biến."
            ]
          },
          keyConcepts: ["Lập phương của một tổng", "Lập phương của một hiệu", "Khai triển lập phương"]
        },
        {
          id: "m8_b8",
          lessonNumber: "Bài 8",
          name: "Bài 8. Tổng và hiệu hai lập phương",
          topicId: "math8_c2",
          topicName: "Chương II. Hằng đẳng thức đáng nhớ và ứng dụng",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhớ và phát biểu 2 hằng đẳng thức: A^3 + B^3 = (A+B)(A^2 - AB + B^2); A^3 - B^3 = (A-B)(A^2 + AB + B^2)."
            ],
            understanding: [
              "Hệ thống hóa đủ 7 Hằng đẳng thức đáng nhớ.",
              "Vận dụng để biến đổi biểu thức đa thức thành tích và ngược lại."
            ],
            application: [
              "Rút gọn biểu thức phức hợp và chứng minh chia hết."
            ]
          },
          keyConcepts: ["Tổng hai lập phương", "Hiệu hai lập phương", "Bảy hằng đẳng thức đáng nhớ", "Bình phương thiếu"]
        },
        {
          id: "m8_b9",
          lessonNumber: "Bài 9",
          name: "Bài 9. Phân tích đa thức thành nhân tử",
          topicId: "math8_c2",
          topicName: "Chương II. Hằng đẳng thức đáng nhớ và ứng dụng",
          periods: 4,
          learningOutcomes: {
            recognition: [
              "Nhận biết các phương pháp phân tích đa thức thành nhân tử: Đặt nhân tử chung, Dùng hằng đẳng thức, Nhóm hạng tử."
            ],
            understanding: [
              "Phối hợp linh hoạt các phương pháp để phân tích đa thức thành tích các nhân tử."
            ],
            application: [
              "Giải phương trình tích A.B = 0 (tìm x), tính nhanh giá trị biểu thức và chứng minh chia hết."
            ]
          },
          keyConcepts: ["Phân tích đa thức thành nhân tử", "Đặt nhân tử chung", "Dùng hằng đẳng thức", "Nhóm hạng tử", "Tìm x"]
        }
      ]
    },
    {
      id: "math8_c3",
      name: "Chương III. Tứ giác",
      lessons: [
        {
          id: "m8_b10",
          lessonNumber: "Bài 10",
          name: "Bài 10. Tứ giác",
          topicId: "math8_c3",
          topicName: "Chương III. Tứ giác",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Định nghĩa tứ giác, tứ giác lồi, các đỉnh, cạnh, góc, đường chéo của tứ giác.",
              "Định lí tổng các góc của một tứ giác bằng 360°."
            ],
            understanding: [
              "Tính số đo một góc của tứ giác khi biết ba góc còn lại."
            ],
            application: [
              "Giải thích cấu trúc khung giàn tứ giác trong thực tế đời sống."
            ]
          },
          keyConcepts: ["Tứ giác", "Tứ giác lồi", "Tổng các góc của tứ giác = 360°"]
        },
        {
          id: "m8_b11",
          lessonNumber: "Bài 11",
          name: "Bài 11. Hình thang cân",
          topicId: "math8_c3",
          topicName: "Chương III. Tứ giác",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Định nghĩa hình thang (hai cạnh đối song song) và hình thang cân (hai góc kề một đáy bằng nhau).",
              "Tính chất của hình thang cân: hai cạnh bên bằng nhau, hai đường chéo bằng nhau.",
              "Dấu hiệu nhận biết hình thang cân (hai góc kề đáy bằng nhau hoặc hai đường chéo bằng nhau)."
            ],
            understanding: [
              "Chứng minh một tứ giác là hình thang cân và suy ra các góc, cạnh bằng nhau."
            ],
            application: [
              "Nhận diện và cắt dán các họa tiết hình thang cân trong đồ thủ công."
            ]
          },
          keyConcepts: ["Hình thang", "Hình thang cân", "Tính chất cạnh bên & đường chéo", "Dấu hiệu nhận biết hình thang cân"]
        },
        {
          id: "m8_b12",
          lessonNumber: "Bài 12",
          name: "Bài 12. Hình bình hành",
          topicId: "math8_c3",
          topicName: "Chương III. Tứ giác",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Định nghĩa hình bình hành (tứ giác có các cạnh đối song song).",
              "Tính chất hình bình hành: các cạnh đối bằng nhau, các góc đối bằng nhau, hai đường chéo cắt nhau tại trung điểm của mỗi đường.",
              "Dấu hiệu nhận biết hình bình hành."
            ],
            understanding: [
              "Vận dụng các dấu hiệu để chứng minh một tứ giác là hình bình hành.",
              "Chứng minh hai đoạn thẳng song song và bằng nhau, ba điểm thẳng hàng."
            ],
            application: [
              "Cơ cấu chuyển động song song của giàn nâng, cánh cổng trượt xếp."
            ]
          },
          keyConcepts: ["Hình bình hành", "Tính chất cạnh đối, góc đối, đường chéo", "Dấu hiệu nhận biết hình bình hành"]
        },
        {
          id: "m8_b13",
          lessonNumber: "Bài 13",
          name: "Bài 13. Hình chữ nhật",
          topicId: "math8_c3",
          topicName: "Chương III. Tứ giác",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Định nghĩa hình chữ nhật (tứ giác có bốn góc vuông).",
              "Tính chất hình chữ nhật: có đầy đủ tính chất của hình bình hành và hình thang cân; hai đường chéo bằng nhau và cắt nhau tại trung điểm mỗi đường.",
              "Dấu hiệu nhận biết hình chữ nhật."
            ],
            understanding: [
              "Chứng minh một tứ giác là hình chữ nhật.",
              "Nắm tính chất tam giác vuông: đường trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền."
            ],
            application: [
              "Kiểm tra khung cửa sổ chữ nhật bằng phương pháp đo độ dài hai đường chéo bằng nhau."
            ]
          },
          keyConcepts: ["Hình chữ nhật", "Hai đường chéo bằng nhau", "Đường trung tuyến trong tam giác vuông", "Dấu hiệu nhận biết"]
        },
        {
          id: "m8_b14",
          lessonNumber: "Bài 14",
          name: "Bài 14. Hình thoi và hình vuông",
          topicId: "math8_c3",
          topicName: "Chương III. Tứ giác",
          periods: 4,
          learningOutcomes: {
            recognition: [
              "Định nghĩa hình thoi (bốn cạnh bằng nhau) và hình vuông (bốn cạnh bằng nhau và bốn góc vuông).",
              "Tính chất hình thoi: hai đường chéo vuông góc với nhau và là đường phân giác các góc.",
              "Tính chất hình vuông: mang đầy đủ tính chất của hình chữ nhật và hình thoi.",
              "Dấu hiệu nhận biết hình thoi và hình vuông."
            ],
            understanding: [
              "Chứng minh một tứ giác là hình thoi hoặc hình vuông.",
              "Vận dụng tính chất đường chéo để tính toán diện tích."
            ],
            application: [
              "Gấp giấy thủ công tạo hình thoi, hình vuông, thiết kế hoa văn trang trí gạch bông."
            ]
          },
          keyConcepts: ["Hình thoi", "Hình vuông", "Đường chéo vuông góc", "Đường phân giác", "Dấu hiệu nhận biết"]
        }
      ]
    },
    {
      id: "math8_c4",
      name: "Chương IV. Định lí Thalès",
      lessons: [
        {
          id: "m8_b15",
          lessonNumber: "Bài 15",
          name: "Bài 15. Định lí Thalès trong tam giác",
          topicId: "math8_c4",
          topicName: "Chương IV. Định lí Thalès",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Khái niệm tỉ số của hai đoạn thẳng và đoạn thẳng tỉ lệ.",
              "Phát biểu Định lí Thalès thuận và đảo trong tam giác: Nếu đường thẳng song song với một cạnh của tam giác và cắt hai cạnh còn lại thì nó định ra trên hai cạnh đó những đoạn thẳng tương ứng tỉ lệ."
            ],
            understanding: [
              "Tính độ dài đoạn thẳng chưa biết dựa vào định lí Thalès.",
              "Chứng minh hai đường thẳng song song bằng định lí Thalès đảo."
            ],
            application: [
              "Đo chiều rộng con sông hoặc khoảng cách giữa hai vị trí không tới được."
            ]
          },
          keyConcepts: ["Tỉ số đoạn thẳng", "Định lí Thalès", "Định lí Thalès đảo", "Đoạn thẳng tương ứng tỉ lệ"]
        },
        {
          id: "m8_b16",
          lessonNumber: "Bài 16",
          name: "Bài 16. Đường trung bình của tam giác",
          topicId: "math8_c4",
          topicName: "Chương IV. Định lí Thalès",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Định nghĩa đường trung bình của tam giác (đoạn thẳng nối trung điểm hai cạnh).",
              "Định lí tính chất đường trung bình: song song với cạnh thứ ba và bằng nửa cạnh đó."
            ],
            understanding: [
              "Chứng minh một đoạn thẳng là đường trung bình của tam giác.",
              "Tính độ dài đoạn thẳng và chứng minh các quan hệ song song."
            ],
            application: [
              "Đo khoảng cách giữa hai mốc tiêu bờ hồ bị ngăn cách bởi mặt nước."
            ]
          },
          keyConcepts: ["Đường trung bình tam giác", "Song song cạnh thứ ba", "Bằng nửa cạnh thứ ba"]
        },
        {
          id: "m8_b17",
          lessonNumber: "Bài 17",
          name: "Bài 17. Tính chất đường phân giác của tam giác",
          topicId: "math8_c4",
          topicName: "Chương IV. Định lí Thalès",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Định lí tính chất đường phân giác trong tam giác: Đường phân giác trong (hoặc ngoài) của một góc trong tam giác chia cạnh đối diện thành hai đoạn thẳng tỉ lệ với hai cạnh kề hai đoạn ấy (DB/DC = AB/AC)."
            ],
            understanding: [
              "Tính độ dài các đoạn thẳng bị chia bởi đường phân giác.",
              "Tính tỉ số diện tích hai tam giác phân chia bởi đường phân giác."
            ],
            application: [
              "Phân chia khuôn viên sân trường hình tam giác theo tỉ lệ các cạnh đường biên."
            ]
          },
          keyConcepts: ["Đường phân giác tam giác", "DB/DC = AB/AC", "Tỉ lệ đoạn thẳng"]
        }
      ]
    },
    {
      id: "math8_c5",
      name: "Chương V. Dữ liệu và biểu đồ",
      lessons: [
        {
          id: "m8_b18",
          lessonNumber: "Bài 18",
          name: "Bài 18. Thu thập và phân loại dữ liệu",
          topicId: "math8_c5",
          topicName: "Chương V. Dữ liệu và biểu đồ",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Phân biệt số liệu rời rạc (đếm được, số nguyên) và số liệu liên tục (đo được, số thực).",
              "Nhận biết các phương pháp thu thập dữ liệu trực tiếp và gián tiếp."
            ],
            understanding: [
              "Đánh giá tính hợp lí và tính đại diện của mẫu dữ liệu thu thập được."
            ],
            application: [
              "Thu thập dữ liệu chiều cao, điểm số, thời gian sử dụng internet của học sinh."
            ]
          },
          keyConcepts: ["Số liệu rời rạc", "Số liệu liên tục", "Thu thập trực tiếp/gián tiếp", "Tính đại diện"]
        },
        {
          id: "m8_b19",
          lessonNumber: "Bài 19",
          name: "Bài 19. Biểu diễn dữ liệu bằng bảng, biểu đồ",
          topicId: "math8_c5",
          topicName: "Chương V. Dữ liệu và biểu đồ",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Lựa chọn loại biểu đồ thích hợp để biểu diễn dữ liệu: Biểu đồ tranh, Biểu đồ cột/cột kép, Biểu đồ hình quạt tròn, Biểu đồ đoạn thẳng."
            ],
            understanding: [
              "Chuyển đổi dữ liệu linh hoạt giữa bảng thống kê và các dạng biểu đồ.",
              "Vẽ biểu đồ biểu diễn chính xác số liệu."
            ],
            application: [
              "Trình bày báo cáo kết quả rèn luyện học tập và hoạt động thể thao của lớp."
            ]
          },
          keyConcepts: ["Lựa chọn biểu đồ", "Biểu đồ cột", "Biểu đồ hình quạt tròn", "Biểu đồ đoạn thẳng"]
        },
        {
          id: "m8_b20",
          lessonNumber: "Bài 20",
          name: "Bài 20. Phân tích số liệu thống kê dựa vào biểu đồ",
          topicId: "math8_c5",
          topicName: "Chương V. Dữ liệu và biểu đồ",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết các lưu ý khi đọc biểu đồ (gốc tọa độ, tỉ lệ xích các trục, mốc thời gian)."
            ],
            understanding: [
              "Phát hiện các lỗi gây hiểu lầm trong biểu đồ thống kê (trục tung không bắt đầu từ 0).",
              "Phân tích dữ liệu để so sánh, rút ra kết luận và dự đoán xu thế."
            ],
            application: [
              "Đọc và phê bình các biểu đồ quảng cáo sản phẩm hoặc số liệu việc làm trên báo chí."
            ]
          },
          keyConcepts: ["Đọc biểu đồ", "Phân tích số liệu", "Lỗi biểu đồ gây hiểu nhầm", "Dự đoán xu thế"]
        }
      ]
    },
    {
      id: "math8_c6",
      name: "Chương VI. Phân thức đại số",
      lessons: [
        {
          id: "m8_b21",
          lessonNumber: "Bài 21",
          name: "Bài 21. Phân thức đại số",
          topicId: "math8_c6",
          topicName: "Chương VI. Phân thức đại số",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Định nghĩa phân thức đại số A/B (với A, B là đa thức, B khác đa thức 0).",
              "Hai phân thức bằng nhau: A/B = C/D khi A.D = B.C.",
              "Khái niệm điều kiện xác định (ĐKXĐ: mẫu thức khác 0)."
            ],
            understanding: [
              "Tìm điều kiện xác định của phân thức đại số.",
              "Tính giá trị của phân thức tại giá trị của biến thỏa mãn ĐKXĐ."
            ],
            application: [
              "Viết biểu thức phân thức biểu thị vận tốc trung bình và thời gian đi đường."
            ]
          },
          keyConcepts: ["Phân thức đại số A/B", "Tử thức và mẫu thức", "Hai phân thức bằng nhau", "Điều kiện xác định"]
        },
        {
          id: "m8_b22",
          lessonNumber: "Bài 22",
          name: "Bài 22. Tính chất cơ bản của phân thức đại số",
          topicId: "math8_c6",
          topicName: "Chương VI. Phân thức đại số",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nắm tính chất cơ bản: nhân/chia cả tử và mẫu với cùng một đa thức khác 0.",
              "Quy tắc đổi dấu: A/B = -A/(-B)."
            ],
            understanding: [
              "Rút gọn phân thức đại số về dạng tối giản.",
              "Quy đồng mẫu thức nhiều phân thức đại số (tìm MTC, nhân tử phụ)."
            ],
            application: [
              "Đơn giản hóa biểu thức tính toán trong các bài toán thực nghiệm."
            ]
          },
          keyConcepts: ["Tính chất cơ bản của phân thức", "Rút gọn phân thức", "Quy đồng mẫu thức", "Mẫu thức chung MTC"]
        },
        {
          id: "m8_b23",
          lessonNumber: "Bài 23",
          name: "Bài 23. Phép cộng và phép trừ phân thức đại số",
          topicId: "math8_c6",
          topicName: "Chương VI. Phân thức đại số",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Quy tắc cộng, trừ các phân thức cùng mẫu và khác mẫu thức.",
              "Khái niệm phân thức đối: -(A/B) = (-A)/B = A/(-B)."
            ],
            understanding: [
              "Thực hiện thành thạo phép cộng và phép trừ phân thức đại số.",
              "Vận dụng tính chất giao hoán, kết hợp và quy tắc dấu ngoặc để tính hợp lí."
            ],
            application: [
              "Giải quyết bài toán về năng suất làm việc chung, tàu chạy xuôi/ngược dòng."
            ]
          },
          keyConcepts: ["Cộng phân thức", "Trừ phân thức", "Phân thức đối", "Tính nhanh phân thức"]
        },
        {
          id: "m8_b24",
          lessonNumber: "Bài 24",
          name: "Bài 24. Phép nhân và phép chia phân thức đại số",
          topicId: "math8_c6",
          topicName: "Chương VI. Phân thức đại số",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Quy tắc nhân phân thức: A/B . C/D = (A.C)/(B.D).",
              "Khái niệm phân thức nghịch đảo của A/B (A, B ≠ 0) là B/A.",
              "Quy tắc chia phân thức: A/B : C/D = A/B . D/C."
            ],
            understanding: [
              "Thực hiện thành thạo các phép nhân, chia và rút gọn biểu thức phân thức phức tạp.",
              "Rút gọn biểu thức điều kiện và tìm giá trị nguyên của biến để phân thức nhận giá trị nguyên."
            ],
            application: [
              "Tính toán lãi suất vay mua nhà trả góp theo công thức tỉ lệ."
            ]
          },
          keyConcepts: ["Nhân phân thức", "Phân thức nghịch đảo", "Chia phân thức", "Rút gọn biểu thức tổng hợp"]
        }
      ]
    },
    {
      id: "math8_c7",
      name: "Chương VII. Phương trình bậc nhất và hàm số bậc nhất",
      lessons: [
        {
          id: "m8_b25",
          lessonNumber: "Bài 25",
          name: "Bài 25. Phương trình bậc nhất một ẩn",
          topicId: "math8_c7",
          topicName: "Chương VII. Phương trình bậc nhất và hàm số bậc nhất",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Định nghĩa phương trình bậc nhất một ẩn: ax + b = 0 (a ≠ 0).",
              "Nắm hai quy tắc biến đổi tương đương: Quy tắc chuyển vế và Quy tắc nhân với một số."
            ],
            understanding: [
              "Giải thành thạo phương trình bậc nhất một ẩn (x = -b/a) và phương trình đưa được về dạng ax + b = 0."
            ],
            application: [
              "Chuyển đổi nhiệt độ giữa độ Celsius (°C) và độ Fahrenheit (°F): C = 5/9 (F - 32)."
            ]
          },
          keyConcepts: ["Phương trình bậc nhất ax+b=0", "Quy tắc chuyển vế", "Quy tắc nhân", "Nghiệm x = -b/a"]
        },
        {
          id: "m8_b26",
          lessonNumber: "Bài 26",
          name: "Bài 26. Giải bài toán bằng cách lập phương trình",
          topicId: "math8_c7",
          topicName: "Chương VII. Phương trình bậc nhất và hàm số bậc nhất",
          periods: 4,
          learningOutcomes: {
            recognition: [
              "Nắm vững 3 bước giải bài toán bằng cách lập phương trình: 1. Lập phương trình (chọn ẩn, đặt ĐK, biểu diễn các đại lượng); 2. Giải phương trình; 3. Trả lời (đối chiếu ĐK)."
            ],
            understanding: [
              "Phân tích mối quan hệ giữa các đại lượng trong đề bài để thiết lập phương trình chính xác."
            ],
            application: [
              "Giải các dạng toán thực tế: toán chuyển động (s = v.t), toán năng suất công việc, toán phần trăm nồng độ dung dịch, toán tài chính lãi suất ngân hàng."
            ]
          },
          keyConcepts: ["Giải bài toán bằng cách lập phương trình", "Chọn ẩn và điều kiện", "Toán chuyển động", "Toán năng suất", "Toán phần trăm"]
        },
        {
          id: "m8_b27",
          lessonNumber: "Bài 27",
          name: "Bài 27. Khái niệm hàm số và đồ thị của hàm số",
          topicId: "math8_c7",
          topicName: "Chương VII. Phương trình bậc nhất và hàm số bậc nhất",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Khái niệm hàm số y = f(x), biến số x và giá trị của hàm số f(x0).",
              "Mặt phẳng tọa độ Oxy, tọa độ của một điểm M(x0; y0) (hoành độ x0, tung độ y0).",
              "Khái niệm đồ thị hàm số là tập hợp tất cả các điểm biểu diễn các cặp giá trị tương ứng (x; y) trên Oxy."
            ],
            understanding: [
              "Lập bảng giá trị của hàm số và biểu diễn các điểm trên mặt phẳng tọa độ Oxy."
            ],
            application: [
              "Mô tả mối quan hệ giữa quãng đường và thời gian (s = 60t) hoặc nhiệt độ theo các giờ trong ngày."
            ]
          },
          keyConcepts: ["Hàm số y = f(x)", "Biến số", "Mặt phẳng tọa độ Oxy", "Tọa độ điểm (x; y)", "Đồ thị hàm số"]
        },
        {
          id: "m8_b28",
          lessonNumber: "Bài 28",
          name: "Bài 28. Hàm số bậc nhất và đồ thị của hàm số bậc nhất",
          topicId: "math8_c7",
          topicName: "Chương VII. Phương trình bậc nhất và hàm số bậc nhất",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Định nghĩa hàm số bậc nhất: y = ax + b (a ≠ 0).",
              "Đồ thị của hàm số y = ax + b là một đường thẳng cắt trục tung tại điểm (0; b) và cắt trục hoành tại (-b/a; 0)."
            ],
            understanding: [
              "Vẽ thành thạo đồ thị của hàm số bậc nhất y = ax + b bằng cách xác định hai điểm đặc biệt trên hai trục tọa độ."
            ],
            application: [
              "Lập công thức tính tiền cước taxi, tiền điện sinh hoạt theo bậc thang."
            ]
          },
          keyConcepts: ["Hàm số bậc nhất y = ax + b", "Đồ thị là đường thẳng", "Giao điểm với hai trục tọa độ"]
        },
        {
          id: "m8_b29",
          lessonNumber: "Bài 29",
          name: "Bài 29. Hệ số góc của đường thẳng",
          topicId: "math8_c7",
          topicName: "Chương VII. Phương trình bậc nhất và hàm số bậc nhất",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Khái niệm góc tạo bởi đường thẳng y = ax + b và trục Ox.",
              "Ý nghĩa của hệ số a gọi là Hệ số góc của đường thẳng: a > 0 thì góc nhọn, a < 0 thì góc tù.",
              "Vị trí tương đối của hai đường thẳng: d // d' khi a = a', b ≠ b'; d trùng d' khi a = a', b = b'; d cắt d' khi a ≠ a'."
            ],
            understanding: [
              "Xác định hệ số góc và tìm điều kiện của tham số m để hai đường thẳng song song, cắt nhau."
            ],
            application: [
              "Đo độ dốc của mái nhà, dốc cầu vượt."
            ]
          },
          keyConcepts: ["Hệ số góc a", "Góc tạo bởi đường thẳng và trục Ox", "Hai đường thẳng song song", "Hai đường thẳng cắt nhau"]
        }
      ]
    },
    {
      id: "math8_c8",
      name: "Chương VIII. Mở đầu về tính xác suất của biến cố",
      lessons: [
        {
          id: "m8_b30",
          lessonNumber: "Bài 30",
          name: "Bài 30. Kết quả có thể và kết quả thuận lợi",
          topicId: "math8_c8",
          topicName: "Chương VIII. Mở đầu về tính xác suất của biến cố",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Liệt kê tất cả các kết quả có thể của một hành động, thực nghiệm ngẫu nhiên.",
              "Xác định các kết quả thuận lợi cho một biến cố E."
            ],
            understanding: [
              "Đếm chính xác số kết quả có thể n(Ω) và số kết quả thuận lợi n(E)."
            ],
            application: [
              "Phân tích các trường hợp xảy ra khi bốc thăm trúng thưởng hoặc gieo đồng thời hai con xúc xắc."
            ]
          },
          keyConcepts: ["Hành động ngẫu nhiên", "Kết quả có thể", "Kết quả thuận lợi", "Liệt kê kết quả"]
        },
        {
          id: "m8_b31",
          lessonNumber: "Bài 31",
          name: "Bài 31. Cách tính xác suất của biến cố bằng tỉ số",
          topicId: "math8_c8",
          topicName: "Chương VIII. Mở đầu về tính xác suất của biến cố",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Công thức tính xác suất của biến cố E trong trường hợp các kết quả là đồng khả năng: P(E) = (Số kết quả thuận lợi cho E) / (Tổng số kết quả có thể) = n(E)/n(Ω)."
            ],
            understanding: [
              "Tính xác suất của các biến cố trong trò chơi quay số, rút thẻ, gieo xúc xắc, chọn ngẫu nhiên học sinh."
            ],
            application: [
              "Đánh giá tính công bằng trong các trò chơi may rủi và cơ hội trúng giải."
            ]
          },
          keyConcepts: ["Công thức tính xác suất", "P(E) = n(E)/n(Ω)", "Đồng khả năng"]
        },
        {
          id: "m8_b32",
          lessonNumber: "Bài 32",
          name: "Bài 32. Mối liên hệ giữa xác suất thực nghiệm với xác suất và ứng dụng",
          topicId: "math8_c8",
          topicName: "Chương VIII. Mở đầu về tính xác suất của biến cố",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết định luật số lớn: khi số lần thực nghiệm n càng lớn thì xác suất thực nghiệm k/n càng xấp xỉ xác suất lí thuyết P(E)."
            ],
            understanding: [
              "Sử dụng xác suất thực nghiệm để ước lượng xác suất của biến cố khi không thể tính trực tiếp lí thuyết.",
              "Dự đoán số lần xuất hiện của sự kiện trong tương lai."
            ],
            application: [
              "Ước lượng tỉ lệ phế phẩm của dây chuyền nhà máy, dự báo tắc đường vào giờ cao điểm."
            ]
          },
          keyConcepts: ["Xác suất thực nghiệm", "Ước lượng xác suất", "Dự đoán số lần xuất hiện"]
        }
      ]
    },
    {
      id: "math8_c9",
      name: "Chương IX. Tam giác đồng dạng",
      lessons: [
        {
          id: "m8_b33",
          lessonNumber: "Bài 33",
          name: "Bài 33. Hai tam giác đồng dạng",
          topicId: "math8_c9",
          topicName: "Chương IX. Tam giác đồng dạng",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Định nghĩa hai tam giác đồng dạng: các góc tương ứng bằng nhau và các cạnh tương ứng tỉ lệ (A'B'/AB = B'C'/BC = A'C'/AC = k).",
              "Kí hiệu đồng dạng (ΔA'B'C' ∽ ΔABC) và tỉ số đồng dạng k.",
              "Định lí: Một đường thẳng cắt hai cạnh tam giác và song song với cạnh thứ ba thì tạo thành một tam giác mới đồng dạng với tam giác đã cho."
            ],
            understanding: [
              "Tính độ dài các cạnh và các góc của tam giác dựa vào tỉ số đồng dạng."
            ],
            application: [
              "Đo bóng cọc trên mặt đất để tính chiều cao cột cờ, tòa tháp."
            ]
          },
          keyConcepts: ["Hai tam giác đồng dạng", "Tỉ số đồng dạng k", "Định lí tạo tam giác đồng dạng"]
        },
        {
          id: "m8_b34",
          lessonNumber: "Bài 34",
          name: "Bài 34. Ba trường hợp đồng dạng của hai tam giác",
          topicId: "math8_c9",
          topicName: "Chương IX. Tam giác đồng dạng",
          periods: 4,
          learningOutcomes: {
            recognition: [
              "Nắm vững 3 trường hợp đồng dạng của hai tam giác: 1. Cạnh - Cạnh - Cạnh (c-c-c); 2. Cạnh - Góc - Cạnh (c-g-c); 3. Góc - Góc (g-g)."
            ],
            understanding: [
              "Chứng minh hai tam giác đồng dạng theo từng trường hợp cụ thể.",
              "Suy ra các hệ thức tích độ dài đoạn thẳng: AB.AC = AD.AE."
            ],
            application: [
              "Đo khoảng cách giữa hai vị trí trên bờ hồ mà không cần sang bờ đối diện."
            ]
          },
          keyConcepts: ["Trường hợp c-c-c", "Trường hợp c-g-c", "Trường hợp g-g", "Chứng minh đồng dạng"]
        },
        {
          id: "m8_b35",
          lessonNumber: "Bài 35",
          name: "Bài 35. Định lí Pythagore và ứng dụng",
          topicId: "math8_c9",
          topicName: "Chương IX. Tam giác đồng dạng",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Phát biểu Định lí Pythagore: Trong một tam giác vuông, bình phương của cạnh huyền bằng tổng các bình phương của hai cạnh góc vuông (BC^2 = AB^2 + AC^2).",
              "Phát biểu Định lí Pythagore đảo (kiểm tra tam giác vuông)."
            ],
            understanding: [
              "Tính độ dài cạnh thứ ba trong tam giác vuông khi biết độ dài hai cạnh kia.",
              "Chứng minh một tam giác là tam giác vuông bằng định lí Pythagore đảo."
            ],
            application: [
              "Tính chiều dài cầu thang, kích thước màn hình TV (inch) theo đường chéo, khoảng cách dây neo cột điện."
            ]
          },
          keyConcepts: ["Định lí Pythagore", "BC^2 = AB^2 + AC^2", "Định lí Pythagore đảo", "Bộ ba số Pythagore"]
        },
        {
          id: "m8_b36",
          lessonNumber: "Bài 36",
          name: "Bài 36. Các trường hợp đồng dạng của hai tam giác vuông",
          topicId: "math8_c9",
          topicName: "Chương IX. Tam giác đồng dạng",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết các trường hợp đồng dạng của tam giác vuông: Một góc nhọn bằng nhau; Hai cạnh góc vuông tỉ lệ; Cạnh huyền và một cạnh góc vuông tỉ lệ."
            ],
            understanding: [
              "Nắm tính chất: Tỉ số diện tích của hai tam giác đồng dạng bằng bình phương tỉ số đồng dạng (S'/S = k^2).",
              "Tỉ số hai đường cao tương ứng bằng tỉ số đồng dạng (h'/h = k)."
            ],
            application: [
              "Ứng dụng tính chiều cao cây cối, tháp chuông dựa trên tam giác vuông đồng dạng bóng nắng."
            ]
          },
          keyConcepts: ["Đồng dạng tam giác vuông", "Cạnh huyền - cạnh góc vuông tỉ lệ", "Tỉ số diện tích bằng k^2"]
        },
        {
          id: "m8_b37",
          lessonNumber: "Bài 37",
          name: "Bài 37. Hình đồng dạng",
          topicId: "math8_c9",
          topicName: "Chương IX. Tam giác đồng dạng",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết khái niệm hình đồng dạng và hình đồng dạng phối cảnh (tâm phối cảnh, tỉ số phóng to / thu nhỏ k).",
              "Nhận diện các hình đồng dạng trong thế giới tự nhiên và kiến trúc nghệ thuật."
            ],
            understanding: [
              "Vẽ hình đồng dạng phối cảnh với tỉ số k cho trước từ tâm O."
            ],
            application: [
              "Phóng to/thu nhỏ bản đồ, tranh ảnh nghệ thuật, búp bê Nga Matryoshka."
            ]
          },
          keyConcepts: ["Hình đồng dạng", "Hình đồng dạng phối cảnh", "Tâm phối cảnh", "Phóng to - Thu nhỏ"]
        }
      ]
    },
    {
      id: "math8_c10",
      name: "Chương X. Một số hình khối trong thực tiễn",
      lessons: [
        {
          id: "m8_b38",
          lessonNumber: "Bài 38",
          name: "Bài 38. Hình chóp tam giác đều",
          topicId: "math8_c10",
          topicName: "Chương X. Một số hình khối trong thực tiễn",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Mô tả các yếu tố của hình chóp tam giác đều S.ABC: đỉnh S, mặt đáy là tam giác đều, các mặt bên là các tam giác cân bằng nhau chung đỉnh S, chiều cao SH, trung đoạn SI.",
              "Công thức: Diện tích xung quanh Sxq = p.d (p: nửa chu vi đáy, d: trung đoạn); Thể tích V = 1/3 Sday . h."
            ],
            understanding: [
              "Tạo lập và gấp hình chóp tam giác đều từ hình khai triển phẳng.",
              "Tính diện tích xung quanh, diện tích toàn phần và thể tích hình chóp tam giác đều."
            ],
            application: [
              "Tính thể tích chóp inox Fansipan, hộp bánh kem tam giác đều, đèn trang trí."
            ]
          },
          keyConcepts: ["Hình chóp tam giác đều", "Mặt đáy tam giác đều", "Mặt bên tam giác cân", "Trung đoạn d", "Sxq = p.d", "V = 1/3 Sday.h"]
        },
        {
          id: "m8_b39",
          lessonNumber: "Bài 39",
          name: "Bài 39. Hình chóp tứ giác đều",
          topicId: "math8_c10",
          topicName: "Chương X. Một số hình khối trong thực tiễn",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Mô tả các yếu tố của hình chóp tứ giác đều S.ABCD: đỉnh S, mặt đáy là hình vuông, các mặt bên là 4 tam giác cân bằng nhau chung đỉnh S, chiều cao SH, trung đoạn SI.",
              "Công thức: Sxq = p.d (p: nửa chu vi đáy hình vuông = 2a, d: trung đoạn); Thể tích V = 1/3 Sday . h = 1/3 a^2 . h."
            ],
            understanding: [
              "Tạo lập mô hình hình chóp tứ giác đều bằng bìa cứng.",
              "Tính diện tích xung quanh, diện tích toàn phần và thể tích hình chóp tứ giác đều."
            ],
            application: [
              "Tính thể tích và diện tích kính bao quanh Kim tự tháp kính Louvre (Pháp), kim tự tháp Kheops, lều cắm trại tứ giác đều."
            ]
          },
          keyConcepts: ["Hình chóp tứ giác đều", "Mặt đáy hình vuông", "Trung đoạn d", "Sxq = p.d", "V = 1/3 a^2.h", "Kim tự tháp"]
        }
      ]
    }
  ]
};
