export interface Lesson {
  id: string;
  lessonNumber: string;
  name: string;
  topicId: string;
  topicName: string;
  periods: number;
  learningOutcomes: {
    recognition: string[];
    understanding: string[];
    application: string[];
  };
  keyConcepts: string[];
}

export interface TextbookGrade {
  grade: string;
  bookSeries: string;
  title: string;
  description: string;
  topics: {
    id: string;
    name: string;
    lessons: Lesson[];
  }[];
}

export const TEXTBOOK_GRADE_6: TextbookGrade = {
  grade: "6",
  bookSeries: "Kết nối tri thức với cuộc sống",
  title: "Tin học 6 - Chương trình GDPT 2018",
  description: "Chuẩn kiến thức, kĩ năng SGK Tin học 6 Kết nối tri thức",
  topics: [
    {
      id: "1",
      name: "Chủ đề 1. Máy tính và cộng đồng",
      lessons: [
        {
          id: "g6_b1",
          lessonNumber: "Bài 1",
          name: "Bài 1. Thông tin và dữ liệu",
          topicId: "1",
          topicName: "Chủ đề 1. Máy tính và cộng đồng",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được sự khác nhau giữa thông tin và dữ liệu.",
              "Nêu được ví dụ minh hoạ về thông tin và dữ liệu.",
              "Nhận biết được vai trò quan trọng của thông tin trong đời sống."
            ],
            understanding: [
              "Giải thích được mối quan hệ giữa dữ liệu, thông tin và vật mang tin.",
              "Phân biệt được các dạng thông tin cơ bản: văn bản, hình ảnh, âm thanh."
            ],
            application: [
              "Phân tích được một tình huống thực tế để chỉ ra dữ liệu thu nhận và thông tin rút ra để ra quyết định."
            ]
          },
          keyConcepts: ["Thông tin", "Dữ liệu", "Vật mang tin", "Xử lí thông tin"]
        },
        {
          id: "g6_b2",
          lessonNumber: "Bài 2",
          name: "Bài 2. Xử lí thông tin",
          topicId: "1",
          topicName: "Chủ đề 1. Máy tính và cộng đồng",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được các bước trong quy trình xử lí thông tin của con người và máy tính.",
              "Nhận biết được các thiết bị tương ứng với các bước xử lí thông tin (thu nhận, lưu trữ, xử lí, truyền xuất)."
            ],
            understanding: [
              "Giải thích được máy tính là công cụ hiệu quả để xử lí thông tin.",
              "So sánh được hoạt động xử lí thông tin của con người và máy tính."
            ],
            application: [
              "Xác định được thiết bị vào/ra phù hợp trong các hoạt động xử lí thông tin cụ thể."
            ]
          },
          keyConcepts: ["Quy trình xử lí thông tin", "Thiết bị vào (Input)", "Thiết bị ra (Output)", "Bộ nhớ", "Bộ xử lí (CPU)"]
        },
        {
          id: "g6_b3",
          lessonNumber: "Bài 3",
          name: "Bài 3. Thông tin trong máy tính",
          topicId: "1",
          topicName: "Chủ đề 1. Máy tính và cộng đồng",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết được máy tính chỉ xử lí thông tin đã được biểu diễn dưới dạng dãy bit (0 và 1).",
              "Nêu được các đơn vị đo dung lượng thông tin cơ bản: Bit, Byte, KB, MB, GB, TB."
            ],
            understanding: [
              "Giải thích được quy đổi giữa các đơn vị đo dung lượng thông tin (1 Byte = 8 Bit; 1 KB = 1024 Byte...).",
              "Ước lượng được dung lượng của các tệp văn bản, ảnh, âm thanh, video."
            ],
            application: [
              "Tính toán được dung lượng thiết bị lưu trữ cần thiết cho các tệp dữ liệu thực tế."
            ]
          },
          keyConcepts: ["Dãy bit", "Kí hiệu nhị phân", "Byte", "KB", "MB", "GB", "TB", "Dung lượng thông tin"]
        }
      ]
    },
    {
      id: "2",
      name: "Chủ đề 2. Mạng máy tính và Internet",
      lessons: [
        {
          id: "g6_b4",
          lessonNumber: "Bài 4",
          name: "Bài 4. Mạng máy tính",
          topicId: "2",
          topicName: "Chủ đề 2. Mạng máy tính và Internet",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được khái niệm mạng máy tính và các thành phần chính của mạng.",
              "Nhận biết được các thiết bị mạng cơ bản: Cáp mạng, Switch, Access Point, Router."
            ],
            understanding: [
              "Giải thích được lợi ích của mạng máy tính trong việc chia sẻ tài nguyên và dữ liệu.",
              "Phân biệt được mạng có dây (Wired) và mạng không dây (Wireless)."
            ],
            application: [
              "Xác định được các thành phần kết nối trong một mô hình mạng gia đình hoặc phòng máy trường học."
            ]
          },
          keyConcepts: ["Mạng máy tính", "Thiết bị mạng", "Cáp mạng", "Switch", "Wi-Fi", "Chia sẻ tài nguyên"]
        },
        {
          id: "g6_b5",
          lessonNumber: "Bài 5",
          name: "Bài 5. Internet",
          topicId: "2",
          topicName: "Chủ đề 2. Mạng máy tính và Internet",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được khái niệm Internet và các đặc điểm chính của mạng toàn cầu.",
              "Biết được một số dịch vụ phổ biến trên Internet: Web, Email, Mạng xã hội, Tìm kiếm."
            ],
            understanding: [
              "Giải thích được tác động của Internet đến đời sống, học tập và giải trí.",
              "Nêu được các nguy cơ tiềm ẩn khi tham gia Internet (lừa đảo, thông tin xấu độc, nghiện mạng)."
            ],
            application: [
              "Biết cách tự bảo vệ thông tin cá nhân và ứng xử văn minh, an toàn trên Internet."
            ]
          },
          keyConcepts: ["Internet", "World Wide Web", "Trình duyệt", "An toàn thông tin", "Dịch vụ Internet"]
        }
      ]
    },
    {
      id: "3",
      name: "Chủ đề 3. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
      lessons: [
        {
          id: "g6_b6",
          lessonNumber: "Bài 6",
          name: "Bài 6. Mạng thông tin toàn cầu (WWW)",
          topicId: "3",
          topicName: "Chủ đề 3. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết được khái niệm WWW, trang web, website, địa chỉ URL và siêu văn bản (Hypertext).",
              "Kể tên được một số trình duyệt web phổ biến: Chrome, Edge, Cốc Cốc, Firefox."
            ],
            understanding: [
              "Giải thích được cách thức liên kết giữa các trang web thông qua siêu liên kết (Hyperlink)."
            ],
            application: [
              "Sử dụng được trình duyệt để truy cập vào các trang web theo địa chỉ cho trước."
            ]
          },
          keyConcepts: ["WWW", "Website", "Trang web", "URL", "Siêu văn bản", "Siêu liên kết", "Trình duyệt web"]
        },
        {
          id: "g6_b7",
          lessonNumber: "Bài 7",
          name: "Bài 7. Tìm kiếm thông tin trên Internet",
          topicId: "3",
          topicName: "Chủ đề 3. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được khái niệm máy tìm kiếm (Search Engine) và từ khóa (Keywords).",
              "Biết sử dụng dấu ngoặc kép \" \" để tìm kiếm chính xác cụm từ."
            ],
            understanding: [
              "Giải thích được vai trò của từ khóa trong việc tìm kiếm thông tin nhanh chóng và chính xác."
            ],
            application: [
              "Thực hiện được việc tìm kiếm thông tin phục vụ học tập bằng máy tìm kiếm Google."
            ]
          },
          keyConcepts: ["Máy tìm kiếm", "Từ khóa", "Tìm kiếm chính xác", "Lọc kết quả"]
        },
        {
          id: "g6_b8",
          lessonNumber: "Bài 8",
          name: "Bài 8. Thư điện tử (Email)",
          topicId: "3",
          topicName: "Chủ đề 3. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được cấu trúc của một địa chỉ email: <tên_người_dùng>@<tên_miền>.",
              "Biết được các thành phần chính của một thư điện tử: Người nhận (To), Tiêu đề (Subject), Nội dung, Tệp đính kèm."
            ],
            understanding: [
              "Giải thích được ưu thế vượt trội của thư điện tử so với thư truyền thống (tốc độ, chi phí, đính kèm)."
            ],
            application: [
              "Thực hiện được việc đăng nhập, soạn, gửi thư và gửi tệp đính kèm an toàn."
            ]
          },
          keyConcepts: ["Email", "Địa chỉ email", "Hộp thư", "Tệp đính kèm", "Mật khẩu"]
        }
      ]
    },
    {
      id: "4",
      name: "Chủ đề 4. Đạo đức, pháp luật và văn hóa trong môi trường số",
      lessons: [
        {
          id: "g6_b9",
          lessonNumber: "Bài 9",
          name: "Bài 9. An toàn thông tin trên không gian mạng",
          topicId: "4",
          topicName: "Chủ đề 4. Đạo đức, pháp luật và văn hóa trong môi trường số",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được các mối nguy hiểm chính: Virus, mã độc, lừa đảo trực tuyến, rò rỉ thông tin cá nhân.",
              "Biết các quy tắc đặt mật khẩu mạnh (chữ hoa, chữ thường, số, kí tự đặc biệt, trên 8 kí tự)."
            ],
            understanding: [
              "Giải thích được sự cần thiết phải bảo mật thông tin cá nhân và bản quyền phần mềm."
            ],
            application: [
              "Thực hiện đúng quy tắc an toàn khi sử dụng máy tính nơi công cộng và trên mạng xã hội."
            ]
          },
          keyConcepts: ["Bảo mật thông tin", "Mật khẩu mạnh", "Bản quyền", "Virus máy tính", "Văn hóa ứng xử mạng"]
        }
      ]
    },
    {
      id: "5",
      name: "Chủ đề 5. Ứng dụng tin học",
      lessons: [
        {
          id: "g6_b10",
          lessonNumber: "Bài 10",
          name: "Bài 10. Sơ đồ tư duy (Mindmap)",
          topicId: "5",
          topicName: "Chủ đề 5. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được khái niệm sơ đồ tư duy và các thành phần chính (Chủ đề chính, nhánh cấp 1, nhánh cấp 2, từ khóa, hình ảnh)."
            ],
            understanding: [
              "Giải thích được lợi ích của sơ đồ tư duy trong việc ghi nhớ, hệ thống hóa và trình bày ý tưởng."
            ],
            application: [
              "Sử dụng phần mềm (Mindomo, XMind...) để tạo được sơ đồ tư duy tóm tắt một bài học cụ thể."
            ]
          },
          keyConcepts: ["Sơ đồ tư duy", "Chủ đề chính", "Nhánh chính", "Nhánh phụ", "Từ khóa"]
        },
        {
          id: "g6_b11",
          lessonNumber: "Bài 11",
          name: "Bài 11. Định dạng văn bản",
          topicId: "5",
          topicName: "Chủ đề 5. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết các công cụ định dạng kí tự (Font, Size, Style, Color) và định dạng đoạn (Align, Line spacing, Indent)."
            ],
            understanding: [
              "Phân biệt được mục đích của định dạng kí tự và định dạng đoạn văn bản."
            ],
            application: [
              "Trình bày một văn bản đẹp mắt, chuẩn mẫu báo cáo hoặc thông báo học tập."
            ]
          },
          keyConcepts: ["Định dạng kí tự", "Định dạng đoạn", "Phông chữ", "Căn lề", "Khoảng cách dòng"]
        },
        {
          id: "g6_b12",
          lessonNumber: "Bài 12",
          name: "Bài 12. Trình bày thông tin ở dạng bảng",
          topicId: "5",
          topicName: "Chủ đề 5. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được các thành phần của bảng: Dòng (Row), Cột (Column), Ô (Cell)."
            ],
            understanding: [
              "Hiểu được tác dụng của bảng trong việc tổng hợp và so sánh số liệu trực quan."
            ],
            application: [
              "Tạo bảng, chèn/xóa hàng cột, gộp ô và định dạng đường viền bảng tính."
            ]
          },
          keyConcepts: ["Bảng (Table)", "Dòng", "Cột", "Ô", "Gộp ô", "Đường viền"]
        }
      ]
    },
    {
      id: "6",
      name: "Chủ đề 6. Giải quyết vấn đề với sự trợ giúp của máy tính",
      lessons: [
        {
          id: "g6_b14",
          lessonNumber: "Bài 14",
          name: "Bài 14. Thuật toán và mô tả thuật toán",
          topicId: "6",
          topicName: "Chủ đề 6. Giải quyết vấn đề với sự trợ giúp của máy tính",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nêu được khái niệm thuật toán là dãy hữu hạn các chỉ dẫn rõ ràng để giải quyết vấn đề.",
              "Biết 2 phương pháp mô tả thuật toán: Liệt kê từng bước bằng ngôn ngữ tự nhiên và Sơ đồ khối (Flowchart)."
            ],
            understanding: [
              "Hiểu ý nghĩa các khối hình chuẩn trong sơ đồ khối (Bắt đầu/Kết thúc: Elip, Nhập/Xuất: Hình bình hành, Xử lí: Hình chữ nhật, Điều kiện: Hình thoi)."
            ],
            application: [
              "Mô tả được thuật toán cho các bài toán đơn giản (tính tổng, tìm số lớn nhất, pha trà...)."
            ]
          },
          keyConcepts: ["Thuật toán", "Đầu vào (Input)", "Đầu ra (Output)", "Sơ đồ khối", "Tính hữu hạn"]
        },
        {
          id: "g6_b15",
          lessonNumber: "Bài 15",
          name: "Bài 15. Các cấu trúc điều khiển cơ bản",
          topicId: "6",
          topicName: "Chủ đề 6. Giải quyết vấn đề với sự trợ giúp của máy tính",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết 3 cấu trúc điều khiển cơ bản: Cấu trúc tuần tự, Cấu trúc rẽ nhánh (Nếu... thì...), Cấu trúc lặp (Lặp với số lần biết trước/chưa biết trước)."
            ],
            understanding: [
              "Giải thích được luồng thực hiện của từng cấu trúc thông qua sơ đồ khối."
            ],
            application: [
              "Vẽ được sơ đồ khối áp dụng các cấu trúc rẽ nhánh và lặp để giải bài toán cụ thể."
            ]
          },
          keyConcepts: ["Cấu trúc tuần tự", "Cấu trúc rẽ nhánh", "Cấu trúc lặp", "Điều kiện"]
        }
      ]
    }
  ]
};

export const TEXTBOOK_GRADE_7: TextbookGrade = {
  grade: "7",
  bookSeries: "Kết nối tri thức với cuộc sống",
  title: "Tin học 7 - Chương trình GDPT 2018",
  description: "Chuẩn kiến thức, kĩ năng SGK Tin học 7 Kết nối tri thức",
  topics: [
    {
      id: "1",
      name: "Chủ đề 1. Máy tính và cộng đồng",
      lessons: [
        {
          id: "g7_b1",
          lessonNumber: "Bài 1",
          name: "Bài 1. Thiết bị vào - ra",
          topicId: "1",
          topicName: "Chủ đề 1. Máy tính và cộng đồng",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được một số thiết bị vào/ra chuyên dụng (máy quét, máy in 3D, màn hình cảm ứng, máy chiếu...).",
              "Biết các cổng kết nối vật lí phổ biến: USB-A, USB-C, HDMI, VGA, Audio Jack."
            ],
            understanding: [
              "Giải thích được quy tắc kết nối thiết bị ngoại vi và an toàn điện với thiết bị CNTT."
            ],
            application: [
              "Thực hiện đúng thao tác gắn, ngắt kết nối thiết bị USB an toàn (Safely Remove Hardware)."
            ]
          },
          keyConcepts: ["Thiết bị vào (Input)", "Thiết bị ra (Output)", "Cổng kết nối", "HDMI", "USB", "Driver thiết bị"]
        },
        {
          id: "g7_b2",
          lessonNumber: "Bài 2",
          name: "Bài 2. Phần mềm ứng dụng và hệ điều hành",
          topicId: "1",
          topicName: "Chủ đề 1. Máy tính và cộng đồng",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được vai trò trung gian của Hệ điều hành (OS) trong việc quản lí phần cứng và cung cấp môi trường cho phần mềm ứng dụng.",
              "Kể tên được một số hệ điều hành phổ biến: Windows, Linux, Android, iOS, macOS."
            ],
            understanding: [
              "Phân biệt được Phần mềm hệ thống (Hệ điều hành) và Phần mềm ứng dụng (Word, Excel, Trình duyệt...)."
            ],
            application: [
              "Quản lí thư mục, tệp và tùy biến giao diện cơ bản trên hệ điều hành máy tính."
            ]
          },
          keyConcepts: ["Hệ điều hành (OS)", "Phần mềm ứng dụng", "Giao diện người dùng (GUI)", "Quản lí tài nguyên"]
        }
      ]
    },
    {
      id: "2",
      name: "Chủ đề 2. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
      lessons: [
        {
          id: "g7_b3",
          lessonNumber: "Bài 3",
          name: "Bài 3. Quản lí dữ liệu trong máy tính",
          topicId: "2",
          topicName: "Chủ đề 2. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Hiểu cấu trúc cây thư mục (Root, Folder, Sub-folder, File, File Extension).",
              "Biết các định dạng đuôi tệp phổ biến: .docx, .xlsx, .pptx, .pdf, .jpg, .png, .mp4, .zip."
            ],
            understanding: [
              "Giải thích được nguyên tắc đặt tên tệp và sắp xếp thư mục khoa học để dễ tìm kiếm."
            ],
            application: [
              "Tạo cây thư mục phân loại tài liệu học tập theo môn học và năm học rõ ràng."
            ]
          },
          keyConcepts: ["Cây thư mục", "Tệp (File)", "Đuôi mở rộng", "Đường dẫn (Path)", "Nén tệp (.zip)"]
        },
        {
          id: "g7_b4",
          lessonNumber: "Bài 4",
          name: "Bài 4. Mạng xã hội và một số kênh trao đổi thông tin trên Internet",
          topicId: "2",
          topicName: "Chủ đề 2. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được khái niệm Mạng xã hội (Social Network) và các tính năng chính (kết bạn, nhắn tin, chia sẻ bài viết, bình luận).",
              "Kể tên được một số mạng xã hội lớn: Facebook, Zalo, YouTube, TikTok."
            ],
            understanding: [
              "Phân tích được mặt tích cực và tiêu cực của mạng xã hội đối với lứa tuổi học sinh."
            ],
            application: [
              "Xây dựng quy tắc ứng xử văn minh và bảo vệ quyền riêng tư cá nhân khi tham gia mạng xã hội."
            ]
          },
          keyConcepts: ["Mạng xã hội", "Quyền riêng tư", "Dấu chân số (Digital Footprint)", "Giao tiếp mạng"]
        }
      ]
    },
    {
      id: "4",
      name: "Chủ đề 4. Ứng dụng tin học - Bảng tính điện tử (Spreadsheet)",
      lessons: [
        {
          id: "g7_b7",
          lessonNumber: "Bài 7",
          name: "Bài 7. Tính toán tự động trên bảng tính",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học - Bảng tính điện tử",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nhận biết giao diện bảng tính (Excel/Google Sheets): Bảng tính (Worksheet), Cột (A,B,C), Dòng (1,2,3), Ô (Cell Reference A1, B2).",
              "Biết công thức luôn bắt đầu bằng dấu bằng (=)."
            ],
            understanding: [
              "Hiểu cách thức cập nhật tự động kết quả khi thay đổi dữ liệu trong các ô tham chiếu."
            ],
            application: [
              "Nhập đúng công thức toán học sử dụng các phép toán: +, -, *, /, ^ trong bảng tính."
            ]
          },
          keyConcepts: ["Bảng tính", "Ô tính", "Địa chỉ ô", "Công thức tính toán", "Tự động cập nhật"]
        },
        {
          id: "g7_b8",
          lessonNumber: "Bài 8",
          name: "Bài 8. Sử dụng các hàm tính toán cơ bản",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học - Bảng tính điện tử",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Biết cú pháp và ý nghĩa các hàm cơ bản: SUM (Tính tổng), AVERAGE (Trung bình cộng), MAX (Giá trị lớn nhất), MIN (Giá trị nhỏ nhất), COUNT (Đếm số lượng ô chứa số)."
            ],
            understanding: [
              "Phân biệt được việc truyền tham số đơn lẻ và truyền khối ô (ví dụ: SUM(A1:A10))."
            ],
            application: [
              "Lập bảng tính điểm trung bình môn học hoặc quản lí thu chi của lớp học chính xác."
            ]
          },
          keyConcepts: ["Hàm SUM", "Hàm AVERAGE", "Hàm MAX", "Hàm MIN", "Hàm COUNT", "Vùng ô (Range)"]
        },
        {
          id: "g7_b9",
          lessonNumber: "Bài 9",
          name: "Bài 9. Định dạng trang tính và in ấn",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học - Bảng tính điện tử",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết các kiểu dữ liệu trong bảng tính: Dữ liệu văn bản (căn trái), Dữ liệu số (căn phải), Dữ liệu ngày tháng.",
              "Biết định dạng số tiền tệ, phần trăm, số thập phân."
            ],
            understanding: [
              "Hiểu cách bố trí bảng tính rõ ràng, kẻ viền và đổ màu tiêu đề để tăng tính chuyên nghiệp."
            ],
            application: [
              "Trình bày hoàn chỉnh một bảng thống kê có viền, căn lề và định dạng số chuẩn xác."
            ]
          },
          keyConcepts: ["Định dạng số", "Kiểu dữ liệu", "Kẻ viền (Borders)", "Gộp ô (Merge & Center)"]
        },
        {
          id: "g7_b10",
          lessonNumber: "Bài 10",
          name: "Bài 10. Trình bày dữ liệu bằng biểu đồ",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học - Bảng tính điện tử",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết các dạng biểu đồ phổ biến: Biểu đồ cột (Column Chart - so sánh số liệu), Biểu đồ tròn (Pie Chart - tỉ lệ phần trăm), Biểu đồ đường (Line Chart - xu hướng theo thời gian)."
            ],
            understanding: [
              "Lựa chọn loại biểu đồ phù hợp nhất với mục đích biểu diễn của dữ liệu."
            ],
            application: [
              "Tạo và chèn biểu đồ trực quan từ bảng dữ liệu điểm hoặc thống kê dân số."
            ]
          },
          keyConcepts: ["Biểu đồ cột", "Biểu đồ tròn", "Biểu đồ đoạn thẳng", "Tiêu đề biểu đồ (Chart Title)", "Chú giải (Legend)"]
        }
      ]
    },
    {
      id: "5",
      name: "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính - Thuật toán tìm kiếm và sắp xếp",
      lessons: [
        {
          id: "g7_b12",
          lessonNumber: "Bài 12",
          name: "Bài 12. Thuật toán tìm kiếm tuần tự (Sequential Search)",
          topicId: "5",
          topicName: "Chủ đề 5. Thuật toán tìm kiếm và sắp xếp",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được ý tưởng của thuật toán tìm kiếm tuần tự: Lần lượt so sánh từ phần tử đầu tiên đến cuối danh sách."
            ],
            understanding: [
              "Giải thích được điều kiện dừng của thuật toán (tìm thấy giá trị hoặc đã duyệt hết danh sách)."
            ],
            application: [
              "Mô phỏng từng bước tìm kiếm một số trong dãy số cho trước bằng thuật toán tuần tự."
            ]
          },
          keyConcepts: ["Tìm kiếm tuần tự", "Duyệt lần lượt", "Trường hợp xấu nhất", "So sánh từng phần tử"]
        },
        {
          id: "g7_b13",
          lessonNumber: "Bài 13",
          name: "Bài 13. Thuật toán tìm kiếm nhị phân (Binary Search)",
          topicId: "5",
          topicName: "Chủ đề 5. Thuật toán tìm kiếm và sắp xếp",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được điều kiện tiên quyết để áp dụng tìm kiếm nhị phân: DANH SÁCH BẮT BUỘC ĐÃ ĐƯỢC SẮP XẾP.",
              "Nêu được ý tưởng: So sánh với phần tử ở giữa, loại bỏ nửa danh sách không chứa mục tiêu."
            ],
            understanding: [
              "Giải thích được tại sao tìm kiếm nhị phân nhanh và hiệu quả hơn tìm kiếm tuần tự rất nhiều trên tập dữ liệu lớn."
            ],
            application: [
              "Mô phỏng từng bước thu hẹp phạm vi tìm kiếm của thuật toán nhị phân trên dãy số đã sắp xếp."
            ]
          },
          keyConcepts: ["Tìm kiếm nhị phân", "Danh sách đã sắp xếp", "Phần tử ở giữa (Mid)", "Chia đôi không gian tìm kiếm"]
        },
        {
          id: "g7_b14",
          lessonNumber: "Bài 14",
          name: "Bài 14. Thuật toán sắp xếp nổi bọt (Bubble Sort)",
          topicId: "5",
          topicName: "Chủ đề 5. Thuật toán tìm kiếm và sắp xếp",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được ý tưởng của thuật toán sắp xếp nổi bọt: So sánh 2 phần tử liền kề, nếu sai thứ tự thì đổi chỗ."
            ],
            understanding: [
              "Hiểu được sau mỗi lượt duyệt, phần tử lớn nhất/nhỏ nhất sẽ 'nổi' về đúng vị trí cuối dãy."
            ],
            application: [
              "Mô phỏng từng vòng lặp đổi chỗ sắp xếp một dãy 5-6 số nguyên theo thứ tự tăng dần."
            ]
          },
          keyConcepts: ["Sắp xếp nổi bọt", "So sánh liền kề", "Đổi chỗ (Swap)", "Lượt duyệt"]
        },
        {
          id: "g7_b15",
          lessonNumber: "Bài 15",
          name: "Bài 15. Thuật toán sắp xếp chọn (Selection Sort)",
          topicId: "5",
          topicName: "Chủ đề 5. Thuật toán tìm kiếm và sắp xếp",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được ý tưởng của thuật toán sắp xếp chọn: Tìm phần tử nhỏ nhất trong dãy chưa sắp xếp, đổi chỗ với phần tử đầu tiên của dãy đó."
            ],
            understanding: [
              "Phân biệt được nguyên lí hoạt động của sắp xếp chọn và sắp xếp nổi bọt."
            ],
            application: [
              "Mô phỏng từng bước chọn và hoán đổi vị trí để sắp xếp danh sách học sinh theo điểm số."
            ]
          },
          keyConcepts: ["Sắp xếp chọn", "Tìm giá trị nhỏ nhất (Min)", "Hoán vị vị trí", "Dãy con đã sắp xếp"]
        }
      ]
    }
  ]
};

export const TEXTBOOK_GRADE_8: TextbookGrade = {
  grade: "8",
  bookSeries: "Kết nối tri thức với cuộc sống",
  title: "Tin học 8 - Chương trình GDPT 2018",
  description: "Chuẩn kiến thức, kĩ năng SGK Tin học 8 Kết nối tri thức",
  topics: [
    {
      id: "1",
      name: "Chủ đề 1. Máy tính và cộng đồng - Lịch sử phát triển máy tính",
      lessons: [
        {
          id: "g8_b1",
          lessonNumber: "Bài 1",
          name: "Bài 1. Lược sử công cụ tính toán",
          topicId: "1",
          topicName: "Chủ đề 1. Máy tính và cộng đồng",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết các mốc lịch sử từ bàn tính cổ, máy tính cơ học Pascaline, máy tính giải tích Babbage đến máy tính điện tử ENIAC.",
              "Biết 5 thế hệ máy tính dựa trên linh kiện điện tử: Đèn điện tử chân không, Transistor (Bán dẫn), Mạch tích hợp (IC), Vi xử lí (VLSI/Microprocessor), Trí tuệ nhân tạo (AI/Siêu máy tính)."
            ],
            understanding: [
              "Hiểu xu hướng phát triển: Kích thước ngày càng nhỏ gọn, tốc độ xử lí siêu nhanh, tiêu thụ ít điện năng và giá thành hợp lí."
            ],
            application: [
              "Trình bày tóm tắt tiến trình phát triển công nghệ thông tin định hình xã hội hiện đại."
            ]
          },
          keyConcepts: ["Pascaline", "ENIAC", "5 thế hệ máy tính", "Transistor", "Mạch tích hợp IC", "Vi xử lí"]
        }
      ]
    },
    {
      id: "4",
      name: "Chủ đề 4. Ứng dụng tin học - Soạn thảo văn bản và Trình chiếu nâng cao",
      lessons: [
        {
          id: "g8_b8",
          lessonNumber: "Bài 8",
          name: "Bài 8. Tạo và định dạng tiêu đề, mục lục tự động trong văn bản",
          topicId: "4",
          topicName: "Chủ đề 4. Soạn thảo văn bản nâng cao",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết sử dụng các Heading Styles (Heading 1, Heading 2, Heading 3) để phân cấp cấu trúc tài liệu.",
              "Biết tính năng chèn bảng mục lục tự động (Table of Contents), đánh số trang tự động (Page Number)."
            ],
            understanding: [
              "Hiểu được sự tiện lợi của mục lục tự động: Tự cập nhật số trang khi nội dung tài liệu bị thay đổi."
            ],
            application: [
              "Tạo một báo cáo nghiên cứu học tập hoàn chỉnh có phân cấp đề mục và mục lục tự động chuẩn chỉ."
            ]
          },
          keyConcepts: ["Heading Styles", "Mục lục tự động", "Đánh số trang", "Header & Footer", "Phân ngắt trang (Page Break)"]
        },
        {
          id: "g8_b9",
          lessonNumber: "Bài 9",
          name: "Bài 9. Trình chiếu nâng cao - Hiệu ứng và Trang chiếu mẫu (Slide Master)",
          topicId: "4",
          topicName: "Chủ đề 4. Soạn thảo văn bản nâng cao",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết phân biệt 4 nhóm hiệu ứng hoạt hình (Animation): Xuất hiện (Entrance), Nhấn mạnh (Emphasis), Biến mất (Exit), Chuyển động theo đường dẫn (Motion Path).",
              "Biết hiệu ứng chuyển slide (Slide Transition) và công cụ Slide Master để định dạng khung mẫu toàn bài."
            ],
            understanding: [
              "Hiểu nguyên tắc sư phạm: Tránh lạm dụng quá nhiều hiệu ứng gây rối mắt người xem."
            ],
            application: [
              "Thiết kế bài thuyết trình báo cáo dự án với Slide Master đồng bộ và hiệu ứng sinh động."
            ]
          },
          keyConcepts: ["Slide Master", "Hiệu ứng Entrance", "Hiệu ứng Transition", "Nhấn mạnh Emphasis", "Đồng bộ giao diện"]
        }
      ]
    },
    {
      id: "5",
      name: "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính - Lập trình trực quan Scratch",
      lessons: [
        {
          id: "g8_b11",
          lessonNumber: "Bài 11",
          name: "Bài 11. Biến trong chương trình Scratch",
          topicId: "5",
          topicName: "Chủ đề 5. Lập trình trực quan Scratch",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được khái niệm Biến (Variable) là vùng nhớ được đặt tên dùng để lưu trữ giá trị có thể thay đổi trong quá trình chạy chương trình.",
              "Biết các khối lệnh tạo biến, gán giá trị (Set variable to...), thay đổi giá trị (Change variable by...)."
            ],
            understanding: [
              "Hiểu cách sử dụng biến để làm bộ đếm (Counter), lưu điểm số (Score) hoặc tính tổng."
            ],
            application: [
              "Lập trình trò chơi đơn giản có tính điểm số tăng dần khi bắt được vật phẩm."
            ]
          },
          keyConcepts: ["Biến (Variable)", "Đặt biến (Set)", "Thay đổi giá trị (Change)", "Điểm số", "Vùng nhớ"]
        },
        {
          id: "g8_b12",
          lessonNumber: "Bài 12",
          name: "Bài 12. Cấu trúc rẽ nhánh trong Scratch",
          topicId: "5",
          topicName: "Chủ đề 5. Lập trình trực quan Scratch",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết khối lệnh điều kiện dạng thiếu (If <condition> then) và dạng đủ (If <condition> then ... Else ...).",
              "Biết các phép toán so sánh (<, =, >) và phép toán logic (and, or, not) trong nhóm Cảm biến/Phép toán."
            ],
            understanding: [
              "Hiểu luồng rẽ nhánh: Lệnh bên trong chỉ được thực thi khi điều kiện trả về kết quả Đúng (True)."
            ],
            application: [
              "Lập trình nhân vật đưa ra phản hồi đúng/sai khi người dùng trả lời câu hỏi trắc nghiệm."
            ]
          },
          keyConcepts: ["Khối lệnh If-Then", "Khối lệnh If-Then-Else", "Phép toán logic", "Điều kiện True/False"]
        },
        {
          id: "g8_b13",
          lessonNumber: "Bài 13",
          name: "Bài 13. Cấu trúc lặp trong Scratch",
          topicId: "5",
          topicName: "Chủ đề 5. Lập trình trực quan Scratch",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Biết 3 khối lệnh lặp trong Scratch: Lặp số lần cố định (Repeat [n]), Lặp vô hạn (Forever), Lặp có điều kiện (Repeat until <condition>)."
            ],
            understanding: [
              "Phân biệt được tình huống áp dụng lặp vô hạn (chờ sự kiện) và lặp dừng khi đạt điều kiện."
            ],
            application: [
              "Lập trình thuật toán vẽ các hình đa giác đều (tam giác đều, hình vuông, ngôi sao 5 cánh) bằng khối lệnh Bút vẽ (Pen)."
            ]
          },
          keyConcepts: ["Lặp Repeat", "Lặp vô hạn Forever", "Lặp Repeat until", "Góc quay (Turn degree)", "Bút vẽ (Pen)"]
        }
      ]
    }
  ]
};

export const TEXTBOOK_GRADE_9: TextbookGrade = {
  grade: "9",
  bookSeries: "Kết nối tri thức với cuộc sống",
  title: "Tin học 9 - Chương trình GDPT 2018",
  description: "Chuẩn kiến thức, kĩ năng SGK Tin học 9 Kết nối tri thức",
  topics: [
    {
      id: "1",
      name: "Chủ đề 1. Máy tính và cộng đồng - Xã hội số & Dịch vụ đám mây",
      lessons: [
        {
          id: "g9_b1",
          lessonNumber: "Bài 1",
          name: "Bài 1. Dịch vụ đám mây và lưu trữ trực tuyến",
          topicId: "1",
          topicName: "Chủ đề 1. Máy tính và cộng đồng",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được khái niệm Điện toán đám mây (Cloud Computing) và các dịch vụ lưu trữ (Google Drive, OneDrive, Dropbox).",
              "Biết các quyền chia sẻ tệp trực tuyến: Chỉ xem (Viewer), Nhận xét (Commenter), Chỉnh sửa (Editor)."
            ],
            understanding: [
              "Giải thích được ưu điểm vượt trội: Truy cập mọi lúc mọi nơi trên mọi thiết bị, đồng bộ hóa tự động, làm việc nhóm thời gian thực."
            ],
            application: [
              "Thực hiện lưu trữ tài liệu lên Drive, thiết lập quyền chia sẻ bảo mật qua liên kết."
            ]
          },
          keyConcepts: ["Điện toán đám mây", "Google Drive", "OneDrive", "Quyền truy cập", "Đồng bộ hóa"]
        },
        {
          id: "g9_b2",
          lessonNumber: "Bài 2",
          name: "Bài 2. Trí tuệ nhân tạo (AI) và xã hội tri thức",
          topicId: "1",
          topicName: "Chủ đề 1. Máy tính và cộng đồng",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được khái niệm cơ bản về Trí tuệ nhân tạo (AI - Artificial Intelligence).",
              "Kể tên được một số ứng dụng AI thực tế: Nhận diện khuôn mặt, trợ lí ảo (Siri, Google Assistant), xe tự lái, dịch thuật tự động, chatbot tạo sinh (Gemini, ChatGPT)."
            ],
            understanding: [
              "Phân tích được cơ hội nghề nghiệp và thách thức của AI đối với quyền riêng tư và bản quyền trí tuệ."
            ],
            application: [
              "Sử dụng công cụ AI một cách có trách nhiệm, văn minh phục vụ học tập và sáng tạo."
            ]
          },
          keyConcepts: ["Trí tuệ nhân tạo (AI)", "Machine Learning", "Chatbot AI", "Nhận diện giọng nói/hình ảnh", "Đạo đức AI"]
        }
      ]
    },
    {
      id: "4",
      name: "Chủ đề 4. Ứng dụng tin học - Đa phương tiện và Xử lí ảnh số (GIMP/Photoshop/Canva)",
      lessons: [
        {
          id: "g9_b6",
          lessonNumber: "Bài 6",
          name: "Bài 6. Phần mềm chỉnh sửa ảnh và lớp ảnh (Layers)",
          topicId: "4",
          topicName: "Chủ đề 4. Đa phương tiện và Xử lí ảnh số",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Hiểu khái niệm Lớp ảnh (Layer) trong xử lí đồ họa số.",
              "Biết các công cụ chọn vùng (Rectangle Select, Ellipse Select, Free Select/Lasso, Fuzzy Select/Magic Wand)."
            ],
            understanding: [
              "Giải thích được tại sao chỉnh sửa trên từng layer giúp bảo vệ ảnh gốc và dễ dàng điều chỉnh chi tiết."
            ],
            application: [
              "Cắt ghép các thành phần ảnh khác nhau, ghép cảnh và điều chỉnh độ sáng/độ tương phản tạo poster tuyên truyền."
            ]
          },
          keyConcepts: ["Layer (Lớp)", "Vùng chọn (Selection)", "Cắt ảnh (Crop)", "Độ tương phản (Contrast)", "Tách nền"]
        }
      ]
    },
    {
      id: "5",
      name: "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính - Lập trình ngôn ngữ bậc cao Python",
      lessons: [
        {
          id: "g9_b9",
          lessonNumber: "Bài 9",
          name: "Bài 9. Làm quen với ngôn ngữ lập trình Python - Biến và Kiểu dữ liệu",
          topicId: "5",
          topicName: "Chủ đề 5. Lập trình Python",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết môi trường chạy Python (IDLE, VS Code, Online Compiler).",
              "Biết các hàm cơ bản: print() xuất kết quả, input() nhập từ bàn phím.",
              "Nhận biết 4 kiểu dữ liệu cơ bản: int (số nguyên), float (số thực), str (chuỗi kí tự), bool (đúng/sai)."
            ],
            understanding: [
              "Hiểu quy tắc đặt tên biến trong Python và sự cần thiết phải chuyển đổi kiểu dữ liệu int(input()) khi nhập số."
            ],
            application: [
              "Viết chương trình nhập vào bán kính r, tính và in ra chu vi, diện tích hình tròn."
            ]
          },
          keyConcepts: ["Ngôn ngữ Python", "Hàm print()", "Hàm input()", "Kiểu int/float/str", "Gán biến (=)"]
        },
        {
          id: "g9_b10",
          lessonNumber: "Bài 10",
          name: "Bài 10. Cấu trúc rẽ nhánh trong Python (if, if-else, if-elif-else)",
          topicId: "5",
          topicName: "Chủ đề 5. Lập trình Python",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Nắm vững cú pháp thụt lề (Indentation - 4 dấu cách) và dấu hai chấm (:) bắt buộc sau câu lệnh if/else.",
              "Biết sử dụng toán tử so sánh (==, !=, >, <, >=, <=) và logic (and, or, not)."
            ],
            understanding: [
              "Hiểu quy trình kiểm tra tuần tự của cấu trúc nhiều nhánh `if ... elif ... else`."
            ],
            application: [
              "Viết chương trình giải phương trình bậc nhất ax + b = 0 hoặc phân loại học lực học sinh theo điểm tổng kết."
            ]
          },
          keyConcepts: ["Câu lệnh if", "Câu lệnh if-else", "Câu lệnh if-elif-else", "Quy tắc thụt lề (Indentation)", "Toán tử so sánh"]
        },
        {
          id: "g9_b11",
          lessonNumber: "Bài 11",
          name: "Bài 11. Cấu trúc lặp với số lần biết trước trong Python (for ... in range)",
          topicId: "5",
          topicName: "Chủ đề 5. Lập trình Python",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Hiểu ý nghĩa hàm `range(start, stop, step)`: sinh dãy số từ start đến stop - 1.",
              "Cú pháp vòng lặp: `for i in range(n):` lặp n lần với i chạy từ 0 đến n-1."
            ],
            understanding: [
              "Hiểu quy trình lặp và cập nhật biến tích lũy tổng (s = s + i) hoặc giai thừa (p = p * i)."
            ],
            application: [
              "Viết chương trình tính tổng S = 1 + 2 + ... + N hoặc in bảng cửu chương."
            ]
          },
          keyConcepts: ["Vòng lặp for", "Hàm range()", "Biến đếm i", "Tích lũy tổng", "Bước nhảy (Step)"]
        },
        {
          id: "g9_b12",
          lessonNumber: "Bài 12",
          name: "Bài 12. Cấu trúc lặp với số lần chưa biết trước trong Python (while)",
          topicId: "5",
          topicName: "Chủ đề 5. Lập trình Python",
          periods: 3,
          learningOutcomes: {
            recognition: [
              "Cú pháp vòng lặp: `while <điều_kiện>:` - khối lệnh lặp được thực thi chừng nào điều kiện còn Đúng (True).",
              "Nhận biết nguy cơ rơi vào vòng lặp vô tận (Infinite Loop) nếu điều kiện lặp không bao giờ trở thành Sai (False)."
            ],
            understanding: [
              "Phân biệt rõ khi nào nên dùng vòng lặp `for` (biết trước số lần) và khi nào dùng `while` (chưa biết trước số lần, phụ thuộc điều kiện thực tế)."
            ],
            application: [
              "Viết chương trình yêu cầu người dùng nhập mật khẩu cho đến khi đúng, hoặc tính số lượng chữ số của một số nguyên N."
            ]
          },
          keyConcepts: ["Vòng lặp while", "Điều kiện dừng", "Vòng lặp vô tận", "Thay đổi biến lặp"]
        }
      ]
    }
  ]
};

export const ALL_TEXTBOOKS = [
  TEXTBOOK_GRADE_6,
  TEXTBOOK_GRADE_7,
  TEXTBOOK_GRADE_8,
  TEXTBOOK_GRADE_9
];

export function getOfficialTextbookReferencePrompt(gradeStr: string, periodStr: string): string {
  const g = String(gradeStr).replace(/[^0-9]/g, "");
  let matched = ALL_TEXTBOOKS.find(tb => tb.grade === g);
  if (!matched) matched = TEXTBOOK_GRADE_6;

  let text = `\n=================================================================================\n`;
  text += `CHUẨN KIẾN THỨC, KỸ NĂNG VÀ NỘI DUNG SGK CHÍNH THỐNG MÔN TIN HỌC LỚP ${matched.grade} (GDPT 2018 - SÁCH KẾT NỐI TRI THỨC)\n`;
  text += `Định dạng kì thi / thời điểm: ${periodStr}\n`;
  text += `=================================================================================\n`;

  matched.topics.forEach(t => {
    text += `\n▶ [${t.name}]\n`;
    t.lessons.forEach(l => {
      text += `  • ${l.name} (${l.periods} tiết):\n`;
      text += `    - Khái niệm trọng tâm: ${l.keyConcepts.join(", ")}\n`;
      text += `    - Mức độ Nhận biết: ${l.learningOutcomes.recognition.join("; ")}\n`;
      text += `    - Mức độ Thông hiểu: ${l.learningOutcomes.understanding.join("; ")}\n`;
      text += `    - Mức độ Vận dụng: ${l.learningOutcomes.application.join("; ")}\n`;
    });
  });

  text += `\n=================================================================================\n`;
  return text;
}
