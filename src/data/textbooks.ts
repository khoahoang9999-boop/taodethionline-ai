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
              "Nêu được ví dụ minh hoạ về thông tin và dữ liệu."
            ],
            understanding: [
              "Giải thích được mối quan hệ giữa thông tin và dữ liệu."
            ],
            application: [
              "Chỉ ra được tầm quan trọng của thông tin trong thực tiễn."
            ]
          },
          keyConcepts: ["Thông tin", "Dữ liệu", "Vật mang tin"]
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
              "Nhận biết được các bước cơ bản trong xử lí thông tin."
            ],
            understanding: [
              "Giải thích được vai trò của thiết bị trong việc xử lí thông tin."
            ],
            application: [
              "Mô tả được quy trình xử lí thông tin của một thiết bị cụ thể."
            ]
          },
          keyConcepts: ["Quy trình xử lí thông tin", "Bộ nhớ", "Bộ xử lí"]
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
              "Biết được thông tin được biểu diễn trong máy tính dưới dạng dãy bit."
            ],
            understanding: [
              "Giải thích được các đơn vị đo dung lượng thông tin."
            ],
            application: [
              "Thực hiện quy đổi được các đơn vị đo dung lượng thông tin."
            ]
          },
          keyConcepts: ["Bit", "Byte", "KB", "MB", "GB", "TB"]
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
              "Nêu được khái niệm mạng máy tính."
            ],
            understanding: [
              "Nêu được các thành phần cơ bản của mạng máy tính."
            ],
            application: [
              "Giải thích được lợi ích của mạng máy tính."
            ]
          },
          keyConcepts: ["Mạng máy tính", "Thiết bị kết nối"]
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
              "Nêu được khái niệm Internet."
            ],
            understanding: [
              "Nêu được các đặc điểm chính của Internet."
            ],
            application: [
              "Liệt kê và giải thích được một số dịch vụ phổ biến trên Internet."
            ]
          },
          keyConcepts: ["Internet", "Dịch vụ Internet"]
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
          name: "Bài 6. Mạng thông tin toàn cầu",
          topicId: "3",
          topicName: "Chủ đề 3. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Trình bày được khái niệm WWW, trang web, website."
            ],
            understanding: [
              "Nêu được khái niệm địa chỉ trang web, trình duyệt web."
            ],
            application: [
              "Thao tác sử dụng được trình duyệt để truy cập trang web."
            ]
          },
          keyConcepts: ["WWW", "Trang web", "Trình duyệt web"]
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
              "Nêu được khái niệm máy tìm kiếm."
            ],
            understanding: [
              "Biết cách sử dụng máy tìm kiếm để tìm thông tin."
            ],
            application: [
              "Thực hiện tìm kiếm được thông tin bằng từ khóa."
            ]
          },
          keyConcepts: ["Máy tìm kiếm", "Từ khoá"]
        },
        {
          id: "g6_b8",
          lessonNumber: "Bài 8",
          name: "Bài 8. Thư điện tử",
          topicId: "3",
          topicName: "Chủ đề 3. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được khái niệm thư điện tử."
            ],
            understanding: [
              "Nhận biết được địa chỉ thư điện tử."
            ],
            application: [
              "Biết cách tạo và gửi, nhận thư điện tử."
            ]
          },
          keyConcepts: ["Thư điện tử", "Email"]
        }
      ]
    },
    {
      id: "4",
      name: "Chủ đề 4. Đạo đức, pháp luật và văn hoá trong môi trường số",
      lessons: [
        {
          id: "g6_b9",
          lessonNumber: "Bài 9",
          name: "Bài 9. An toàn thông tin trên Internet",
          topicId: "4",
          topicName: "Chủ đề 4. Đạo đức, pháp luật và văn hoá trong môi trường số",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được các nguy cơ trên Internet."
            ],
            understanding: [
              "Biết cách phòng tránh một số rủi ro khi dùng Internet."
            ],
            application: [
              "Biết cách bảo vệ thông tin cá nhân."
            ]
          },
          keyConcepts: ["An toàn thông tin", "Bảo mật", "Virus"]
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
          name: "Bài 10. Sơ đồ tư duy",
          topicId: "5",
          topicName: "Chủ đề 5. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được khái niệm sơ đồ tư duy."
            ],
            understanding: [
              "Nêu được ưu điểm của sơ đồ tư duy."
            ],
            application: [
              "Tạo được sơ đồ tư duy đơn giản."
            ]
          },
          keyConcepts: ["Sơ đồ tư duy"]
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
              "Nêu được các thao tác định dạng văn bản."
            ],
            understanding: [
              "Nêu được ý nghĩa của các định dạng văn bản."
            ],
            application: [
              "Thực hiện được định dạng văn bản."
            ]
          },
          keyConcepts: ["Định dạng văn bản"]
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
              "Nhận biết được bảng biểu trong soạn thảo."
            ],
            understanding: [
              "Nêu được cách chèn và chỉnh sửa bảng biểu."
            ],
            application: [
              "Trình bày được thông tin dưới dạng bảng."
            ]
          },
          keyConcepts: ["Bảng biểu"]
        },
        {
          id: "g6_b13",
          lessonNumber: "Bài 13",
          name: "Bài 13. Tìm kiếm và thay thế",
          topicId: "5",
          topicName: "Chủ đề 5. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được công cụ tìm kiếm và thay thế."
            ],
            understanding: [
              "Nêu được lợi ích của tìm kiếm và thay thế."
            ],
            application: [
              "Thực hiện được tìm kiếm và thay thế văn bản."
            ]
          },
          keyConcepts: ["Tìm kiếm", "Thay thế"]
        },
        {
          id: "g6_b14",
          lessonNumber: "Bài 14",
          name: "Bài 14. Thực hành tổng hợp: Hoàn thiện sổ lưu niệm",
          topicId: "5",
          topicName: "Chủ đề 5. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được các công đoạn cần thực hiện."
            ],
            understanding: [
              "Hiểu được cách vận dụng tổng hợp các kĩ năng."
            ],
            application: [
              "Tạo được sản phẩm hoàn chỉnh."
            ]
          },
          keyConcepts: ["Thực hành tổng hợp"]
        }
      ]
    },
    {
      id: "6",
      name: "Chủ đề 6. Giải quyết vấn đề với sự trợ giúp của máy tính",
      lessons: [
        {
          id: "g6_b15",
          lessonNumber: "Bài 15",
          name: "Bài 15. Thuật toán",
          topicId: "6",
          topicName: "Chủ đề 6. Giải quyết vấn đề với sự trợ giúp của máy tính",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được khái niệm thuật toán."
            ],
            understanding: [
              "Mô tả được thuật toán bằng ngôn ngữ tự nhiên."
            ],
            application: [
              "Lập được thuật toán đơn giản."
            ]
          },
          keyConcepts: ["Thuật toán"]
        },
        {
          id: "g6_b16",
          lessonNumber: "Bài 16",
          name: "Bài 16. Các cấu trúc điều khiển",
          topicId: "6",
          topicName: "Chủ đề 6. Giải quyết vấn đề với sự trợ giúp của máy tính",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được các cấu trúc điều khiển."
            ],
            understanding: [
              "Hiểu được hoạt động của các cấu trúc điều khiển."
            ],
            application: [
              "Vận dụng cấu trúc điều khiển để mô tả thuật toán."
            ]
          },
          keyConcepts: ["Cấu trúc tuần tự", "Cấu trúc rẽ nhánh", "Cấu trúc lặp"]
        },
        {
          id: "g6_b17",
          lessonNumber: "Bài 17",
          name: "Bài 17. Chương trình máy tính",
          topicId: "6",
          topicName: "Chủ đề 6. Giải quyết vấn đề với sự trợ giúp của máy tính",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được khái niệm chương trình máy tính."
            ],
            understanding: [
              "Hiểu được mối liên hệ giữa thuật toán và chương trình."
            ],
            application: [
              "Viết được chương trình đơn giản."
            ]
          },
          keyConcepts: ["Chương trình", "Ngôn ngữ lập trình"]
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
          name: "Bài 1. Thiết bị vào – ra",
          topicId: "1",
          topicName: "Chủ đề 1. Máy tính và cộng đồng",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết và nhận ra được các thiết bị vào – ra cơ bản của máy tính."
            ],
            understanding: [
              "Hiểu được chức năng của các thiết bị vào – ra trong hệ thống máy tính."
            ],
            application: [
              "Sử dụng đúng cách một số thiết bị vào – ra thông dụng."
            ]
          },
          keyConcepts: ["Thiết bị vào", "Thiết bị ra", "Máy tính"]
        },
        {
          id: "g7_b2",
          lessonNumber: "Bài 2",
          name: "Bài 2. Phần mềm máy tính",
          topicId: "1",
          topicName: "Chủ đề 1. Máy tính và cộng đồng",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được khái niệm hệ điều hành và phần mềm ứng dụng."
            ],
            understanding: [
              "Phân biệt được hệ điều hành và phần mềm ứng dụng."
            ],
            application: [
              "Chỉ ra được một số phần mềm ứng dụng và hệ điều hành thông dụng."
            ]
          },
          keyConcepts: ["Hệ điều hành", "Phần mềm ứng dụng"]
        },
        {
          id: "g7_b3",
          lessonNumber: "Bài 3",
          name: "Bài 3. Quản lí dữ liệu trong máy tính",
          topicId: "1",
          topicName: "Chủ đề 1. Máy tính và cộng đồng",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được thế nào là tệp, thư mục và đường dẫn."
            ],
            understanding: [
              "Hiểu được cấu trúc cây thư mục trong máy tính."
            ],
            application: [
              "Thực hiện được các thao tác cơ bản với tệp và thư mục."
            ]
          },
          keyConcepts: ["Tệp", "Thư mục", "Đường dẫn", "Quản lí dữ liệu"]
        }
      ]
    },
    {
      id: "2",
      name: "Chủ đề 2. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
      lessons: [
        {
          id: "g7_b4",
          lessonNumber: "Bài 4",
          name: "Bài 4. Mạng xã hội và một số kênh trao đổi thông tin trên Internet",
          topicId: "2",
          topicName: "Chủ đề 2. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được khái niệm mạng xã hội và kênh trao đổi thông tin."
            ],
            understanding: [
              "Hiểu được chức năng cơ bản của mạng xã hội."
            ],
            application: [
              "Sử dụng được một số chức năng cơ bản của một mạng xã hội."
            ]
          },
          keyConcepts: ["Mạng xã hội", "Kênh trao đổi thông tin"]
        }
      ]
    },
    {
      id: "3",
      name: "Chủ đề 3. Đạo đức, pháp luật và văn hoá trong môi trường số",
      lessons: [
        {
          id: "g7_b5",
          lessonNumber: "Bài 5",
          name: "Bài 5. Ứng xử trên mạng",
          topicId: "3",
          topicName: "Chủ đề 3. Đạo đức, pháp luật và văn hoá trong môi trường số",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được những thông tin không phù hợp trên mạng."
            ],
            understanding: [
              "Trình bày được cách ứng xử hợp lí, an toàn khi giao tiếp trên mạng."
            ],
            application: [
              "Vận dụng được quy tắc ứng xử để xử lí tình huống trên mạng."
            ]
          },
          keyConcepts: ["Ứng xử trên mạng", "Văn hoá mạng"]
        }
      ]
    },
    {
      id: "4",
      name: "Chủ đề 4. Ứng dụng tin học",
      lessons: [
        {
          id: "g7_b6",
          lessonNumber: "Bài 6",
          name: "Bài 6. Làm quen với phần mềm bảng tính",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được giao diện của phần mềm bảng tính."
            ],
            understanding: [
              "Hiểu được cấu trúc của bảng tính (hàng, cột, ô, trang tính)."
            ],
            application: [
              "Nhập được dữ liệu và lưu được bảng tính."
            ]
          },
          keyConcepts: ["Phần mềm bảng tính", "Trang tính", "Ô tính"]
        },
        {
          id: "g7_b7",
          lessonNumber: "Bài 7",
          name: "Bài 7. Tính toán tự động trên bảng tính",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết cách nhập công thức vào ô tính."
            ],
            understanding: [
              "Hiểu được sự thay đổi tự động của kết quả khi dữ liệu thay đổi."
            ],
            application: [
              "Sử dụng được công thức để thực hiện các phép tính cơ bản."
            ]
          },
          keyConcepts: ["Công thức", "Tính toán tự động"]
        },
        {
          id: "g7_b8",
          lessonNumber: "Bài 8",
          name: "Bài 8. Công cụ hỗ trợ tính toán",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được một số hàm cơ bản (SUM, AVERAGE, MAX, MIN)."
            ],
            understanding: [
              "Hiểu được cú pháp và chức năng của các hàm cơ bản."
            ],
            application: [
              "Sử dụng được các hàm cơ bản để tính toán."
            ]
          },
          keyConcepts: ["Hàm", "SUM", "AVERAGE", "MAX", "MIN"]
        },
        {
          id: "g7_b9",
          lessonNumber: "Bài 9",
          name: "Bài 9. Trình bày bảng tính",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được các thao tác định dạng dữ liệu trong bảng tính."
            ],
            understanding: [
              "Hiểu được tác dụng của việc định dạng bảng tính."
            ],
            application: [
              "Thực hiện được các thao tác định dạng cơ bản."
            ]
          },
          keyConcepts: ["Định dạng bảng tính"]
        },
        {
          id: "g7_b10",
          lessonNumber: "Bài 10",
          name: "Bài 10. Hoàn thiện bảng tính",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được các công cụ in ấn bảng tính."
            ],
            understanding: [
              "Hiểu được cách thiết lập thông số trang in."
            ],
            application: [
              "Thực hiện được việc thiết lập trang in và in ấn bảng tính."
            ]
          },
          keyConcepts: ["In ấn", "Thiết lập trang in"]
        },
        {
          id: "g7_b11",
          lessonNumber: "Bài 11",
          name: "Bài 11. Tạo bài trình chiếu",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được giao diện của phần mềm trình chiếu."
            ],
            understanding: [
              "Nêu được cấu trúc cơ bản của một bài trình chiếu."
            ],
            application: [
              "Tạo được một bài trình chiếu cơ bản có văn bản và hình ảnh."
            ]
          },
          keyConcepts: ["Phần mềm trình chiếu", "Trang chiếu"]
        },
        {
          id: "g7_b12",
          lessonNumber: "Bài 12",
          name: "Bài 12. Định dạng đối tượng trên trang chiếu",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được các công cụ định dạng đối tượng."
            ],
            understanding: [
              "Hiểu được tác dụng của hiệu ứng đối với bài trình chiếu."
            ],
            application: [
              "Thực hiện được định dạng văn bản, hình ảnh và tạo hiệu ứng đơn giản."
            ]
          },
          keyConcepts: ["Định dạng đối tượng", "Hiệu ứng"]
        },
        {
          id: "g7_b13",
          lessonNumber: "Bài 13",
          name: "Bài 13. Thực hành tổng hợp: Hoàn thiện bài trình chiếu",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được các bước hoàn thiện một sản phẩm trình chiếu."
            ],
            understanding: [
              "Hiểu được cách thức phối hợp các chức năng của phần mềm."
            ],
            application: [
              "Tạo được một bài trình chiếu hoàn chỉnh theo chủ đề."
            ]
          },
          keyConcepts: ["Thực hành tổng hợp", "Hoàn thiện bài trình chiếu"]
        }
      ]
    },
    {
      id: "5",
      name: "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính",
      lessons: [
        {
          id: "g7_b14",
          lessonNumber: "Bài 14",
          name: "Bài 14. Thuật toán tìm kiếm tuần tự",
          topicId: "5",
          topicName: "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được ý tưởng của thuật toán tìm kiếm tuần tự."
            ],
            understanding: [
              "Mô tả được các bước thực hiện thuật toán tìm kiếm tuần tự."
            ],
            application: [
              "Thực hiện được tìm kiếm tuần tự trên một dãy dữ liệu cho trước."
            ]
          },
          keyConcepts: ["Tìm kiếm tuần tự"]
        },
        {
          id: "g7_b15",
          lessonNumber: "Bài 15",
          name: "Bài 15. Thuật toán tìm kiếm nhị phân",
          topicId: "5",
          topicName: "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được ý tưởng của thuật toán tìm kiếm nhị phân."
            ],
            understanding: [
              "Mô tả được các bước thực hiện thuật toán tìm kiếm nhị phân."
            ],
            application: [
              "Thực hiện được tìm kiếm nhị phân trên một dãy dữ liệu đã sắp xếp."
            ]
          },
          keyConcepts: ["Tìm kiếm nhị phân"]
        },
        {
          id: "g7_b16",
          lessonNumber: "Bài 16",
          name: "Bài 16. Thuật toán sắp xếp",
          topicId: "5",
          topicName: "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được ý tưởng của thuật toán sắp xếp nổi bọt hoặc chọn."
            ],
            understanding: [
              "Mô tả được các bước thực hiện thuật toán sắp xếp."
            ],
            application: [
              "Thực hiện được việc sắp xếp một dãy dữ liệu bằng thuật toán."
            ]
          },
          keyConcepts: ["Thuật toán sắp xếp", "Sắp xếp nổi bọt", "Sắp xếp chọn"]
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
      name: "Chủ đề 1. Máy tính và cộng đồng",
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
              "Nêu được sơ lược lịch sử phát triển của công cụ tính toán."
            ],
            understanding: [
              "Giải thích được vai trò của công cụ tính toán trong sự phát triển của xã hội."
            ],
            application: [
              "Phân tích được sự thay đổi của công cụ tính toán qua các thời kì."
            ]
          },
          keyConcepts: ["Lịch sử tính toán", "Công cụ tính toán"]
        }
      ]
    },
    {
      id: "2",
      name: "Chủ đề 2. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
      lessons: [
        {
          id: "g8_b2",
          lessonNumber: "Bài 2",
          name: "Bài 2. Thông tin trong môi trường số",
          topicId: "2",
          topicName: "Chủ đề 2. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được thông tin số và đặc điểm của nó."
            ],
            understanding: [
              "Hiểu được sự khác biệt giữa thông tin số và thông tin truyền thống."
            ],
            application: [
              "Chỉ ra được các loại thông tin số thường gặp."
            ]
          },
          keyConcepts: ["Thông tin số", "Môi trường số"]
        },
        {
          id: "g8_b3",
          lessonNumber: "Bài 3",
          name: "Bài 3. Thực hành: Khai thác thông tin số",
          topicId: "2",
          topicName: "Chủ đề 2. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết cách tìm kiếm và khai thác thông tin trên môi trường số."
            ],
            understanding: [
              "Hiểu được cách đánh giá độ tin cậy của thông tin."
            ],
            application: [
              "Thực hành tìm kiếm và tổng hợp thông tin từ nhiều nguồn số."
            ]
          },
          keyConcepts: ["Khai thác thông tin", "Thông tin số"]
        }
      ]
    },
    {
      id: "3",
      name: "Chủ đề 3. Đạo đức, pháp luật và văn hoá trong môi trường số",
      lessons: [
        {
          id: "g8_b4",
          lessonNumber: "Bài 4",
          name: "Bài 4. Đạo đức và văn hoá trong sử dụng công nghệ kĩ thuật số",
          topicId: "3",
          topicName: "Chủ đề 3. Đạo đức, pháp luật và văn hoá trong môi trường số",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được các quy định cơ bản về đạo đức, pháp luật trên môi trường mạng."
            ],
            understanding: [
              "Hiểu được hậu quả của việc vi phạm đạo đức, pháp luật khi sử dụng công nghệ."
            ],
            application: [
              "Tuân thủ các quy định và ứng xử có văn hoá trên mạng."
            ]
          },
          keyConcepts: ["Đạo đức mạng", "Pháp luật mạng", "Công nghệ kĩ thuật số"]
        }
      ]
    },
    {
      id: "4",
      name: "Chủ đề 4. Ứng dụng tin học",
      lessons: [
        {
          id: "g8_b5",
          lessonNumber: "Bài 5",
          name: "Bài 5. Sử dụng bảng tính giải quyết bài toán thực tế",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được khả năng của bảng tính trong giải quyết bài toán."
            ],
            understanding: [
              "Hiểu được cách phân tích bài toán thực tế để sử dụng bảng tính."
            ],
            application: [
              "Thiết lập bảng tính để giải quyết một bài toán quản lí đơn giản."
            ]
          },
          keyConcepts: ["Bảng tính", "Bài toán thực tế"]
        },
        {
          id: "g8_b6",
          lessonNumber: "Bài 6",
          name: "Bài 6. Sắp xếp và lọc dữ liệu",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết được chức năng sắp xếp và lọc dữ liệu."
            ],
            understanding: [
              "Hiểu được nguyên tắc sắp xếp và điều kiện lọc."
            ],
            application: [
              "Thực hiện được thao tác sắp xếp và lọc dữ liệu theo yêu cầu."
            ]
          },
          keyConcepts: ["Sắp xếp dữ liệu", "Lọc dữ liệu"]
        },
        {
          id: "g8_b7",
          lessonNumber: "Bài 7",
          name: "Bài 7. Trực quan hoá dữ liệu",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được các loại biểu đồ cơ bản."
            ],
            understanding: [
              "Hiểu được mục đích sử dụng của từng loại biểu đồ."
            ],
            application: [
              "Tạo được biểu đồ để trực quan hóa dữ liệu trên bảng tính."
            ]
          },
          keyConcepts: ["Biểu đồ", "Trực quan hoá dữ liệu"]
        },
        {
          id: "g8_b8a",
          lessonNumber: "Bài 8a",
          name: "Bài 8a. Làm việc với danh sách dạng liệt kê và hình ảnh trong văn bản",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được định dạng danh sách và hình ảnh trong văn bản."
            ],
            understanding: [
              "Hiểu cách sử dụng danh sách liệt kê."
            ],
            application: [
              "Thực hiện tạo danh sách và chèn hình ảnh vào văn bản."
            ]
          },
          keyConcepts: ["Danh sách liệt kê", "Hình ảnh"]
        },
        {
          id: "g8_b9a",
          lessonNumber: "Bài 9a",
          name: "Bài 9a. Tạo đầu trang, chân trang cho văn bản",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được vùng đầu trang và chân trang."
            ],
            understanding: [
              "Hiểu ý nghĩa của đầu trang và chân trang."
            ],
            application: [
              "Tạo được đầu trang, chân trang và đánh số trang."
            ]
          },
          keyConcepts: ["Đầu trang", "Chân trang", "Đánh số trang"]
        },
        {
          id: "g8_b10a",
          lessonNumber: "Bài 10a",
          name: "Bài 10a. Định dạng nâng cao cho trang chiếu",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết các chức năng định dạng nâng cao của phần mềm trình chiếu."
            ],
            understanding: [
              "Hiểu cách sử dụng các định dạng nâng cao để làm bài trình chiếu đẹp hơn."
            ],
            application: [
              "Thực hiện được định dạng nâng cao cho bài trình chiếu."
            ]
          },
          keyConcepts: ["Định dạng nâng cao", "Trang chiếu"]
        },
        {
          id: "g8_b11a",
          lessonNumber: "Bài 11a",
          name: "Bài 11a. Sử dụng bản mẫu tạo bài trình chiếu",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được bản mẫu (template) trong phần mềm trình chiếu."
            ],
            understanding: [
              "Hiểu lợi ích của việc dùng bản mẫu."
            ],
            application: [
              "Sử dụng bản mẫu để tạo nhanh bài trình chiếu."
            ]
          },
          keyConcepts: ["Bản mẫu (Template)", "Trình chiếu"]
        },
        {
          id: "g8_b8b",
          lessonNumber: "Bài 8b",
          name: "Bài 8b. Phần mềm chỉnh sửa ảnh",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết về phần mềm chỉnh sửa ảnh."
            ],
            understanding: [
              "Hiểu các tính năng cơ bản của phần mềm chỉnh sửa ảnh."
            ],
            application: [
              "Thực hiện các thao tác mở, xem và lưu ảnh."
            ]
          },
          keyConcepts: ["Phần mềm chỉnh sửa ảnh"]
        },
        {
          id: "g8_b9b",
          lessonNumber: "Bài 9b",
          name: "Bài 9b. Thay đổi khung hình, kích thước ảnh",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết các công cụ cắt ghép và thay đổi kích thước ảnh."
            ],
            understanding: [
              "Hiểu nguyên lí thay đổi khung hình."
            ],
            application: [
              "Thực hiện thay đổi kích thước và cắt cúp ảnh."
            ]
          },
          keyConcepts: ["Khung hình", "Kích thước ảnh"]
        },
        {
          id: "g8_b10b",
          lessonNumber: "Bài 10b",
          name: "Bài 10b. Thêm văn bản, tạo hiệu ứng cho ảnh",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết cách chèn chữ và áp dụng hiệu ứng cho ảnh."
            ],
            understanding: [
              "Hiểu mục đích của việc thêm văn bản và hiệu ứng vào ảnh."
            ],
            application: [
              "Thêm được văn bản và tạo hiệu ứng cho ảnh."
            ]
          },
          keyConcepts: ["Thêm văn bản", "Hiệu ứng ảnh"]
        },
        {
          id: "g8_b11b",
          lessonNumber: "Bài 11b",
          name: "Bài 11b. Thực hành tổng hợp",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được các công cụ chỉnh sửa tổng hợp."
            ],
            understanding: [
              "Hiểu cách thức kết hợp nhiều công cụ."
            ],
            application: [
              "Tạo được một sản phẩm ảnh hoàn chỉnh."
            ]
          },
          keyConcepts: ["Thực hành tổng hợp ảnh"]
        }
      ]
    },
    {
      id: "5",
      name: "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính",
      lessons: [
        {
          id: "g8_b12",
          lessonNumber: "Bài 12",
          name: "Bài 12. Từ thuật toán đến chương trình",
          topicId: "5",
          topicName: "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được mối quan hệ giữa thuật toán và mã lệnh."
            ],
            understanding: [
              "Hiểu được cách thức chuyển đổi từ thuật toán sang chương trình."
            ],
            application: [
              "Biểu diễn một thuật toán đơn giản thành chương trình."
            ]
          },
          keyConcepts: ["Thuật toán", "Chương trình"]
        },
        {
          id: "g8_b13",
          lessonNumber: "Bài 13",
          name: "Bài 13. Biểu diễn dữ liệu",
          topicId: "5",
          topicName: "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết các kiểu dữ liệu cơ bản trong lập trình."
            ],
            understanding: [
              "Hiểu được cách máy tính lưu trữ và biểu diễn dữ liệu."
            ],
            application: [
              "Khai báo và sử dụng biến với các kiểu dữ liệu phù hợp."
            ]
          },
          keyConcepts: ["Biểu diễn dữ liệu", "Kiểu dữ liệu", "Biến"]
        },
        {
          id: "g8_b14",
          lessonNumber: "Bài 14",
          name: "Bài 14. Cấu trúc điều khiển",
          topicId: "5",
          topicName: "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được các cấu trúc rẽ nhánh và lặp."
            ],
            understanding: [
              "Hiểu cơ chế hoạt động của cấu trúc điều khiển."
            ],
            application: [
              "Sử dụng được cấu trúc điều khiển để viết chương trình."
            ]
          },
          keyConcepts: ["Cấu trúc điều khiển", "Rẽ nhánh", "Lặp"]
        },
        {
          id: "g8_b15",
          lessonNumber: "Bài 15",
          name: "Bài 15. Gỡ lỗi",
          topicId: "5",
          topicName: "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết thế nào là lỗi chương trình."
            ],
            understanding: [
              "Hiểu được nguyên nhân gây ra một số lỗi thường gặp."
            ],
            application: [
              "Phát hiện và sửa được lỗi cơ bản trong chương trình."
            ]
          },
          keyConcepts: ["Gỡ lỗi", "Lỗi chương trình"]
        }
      ]
    },
    {
      id: "6",
      name: "Chủ đề 6. Hướng nghiệp với Tin học",
      lessons: [
        {
          id: "g8_b16",
          lessonNumber: "Bài 16",
          name: "Bài 16. Tin học với nghề nghiệp",
          topicId: "6",
          topicName: "Chủ đề 6. Hướng nghiệp với Tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được vai trò của tin học trong các nhóm nghề nghiệp."
            ],
            understanding: [
              "Hiểu được tác động của tin học đến cơ hội việc làm."
            ],
            application: [
              "Định hướng nghề nghiệp liên quan đến tin học."
            ]
          },
          keyConcepts: ["Hướng nghiệp", "Tin học và nghề nghiệp"]
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
      name: "Chủ đề 1. Máy tính và cộng đồng",
      lessons: [
        {
          id: "g9_b1",
          lessonNumber: "Bài 1",
          name: "Bài 1. Thế giới kĩ thuật số",
          topicId: "1",
          topicName: "Chủ đề 1. Máy tính và cộng đồng",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được khái niệm về thế giới kĩ thuật số."
            ],
            understanding: [
              "Giải thích được sự khác biệt giữa thế giới thực và thế giới kĩ thuật số."
            ],
            application: [
              "Phân tích được tác động của thế giới kĩ thuật số đến đời sống xã hội."
            ]
          },
          keyConcepts: ["Thế giới kĩ thuật số", "Công nghệ số"]
        }
      ]
    },
    {
      id: "2",
      name: "Chủ đề 2. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
      lessons: [
        {
          id: "g9_b2",
          lessonNumber: "Bài 2",
          name: "Bài 2. Thông tin trong giải quyết vấn đề",
          topicId: "2",
          topicName: "Chủ đề 2. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được vai trò của thông tin trong giải quyết vấn đề."
            ],
            understanding: [
              "Hiểu cách thức tổ chức thông tin để phục vụ giải quyết vấn đề."
            ],
            application: [
              "Vận dụng thông tin thu thập được để đưa ra giải pháp cho một vấn đề thực tiễn."
            ]
          },
          keyConcepts: ["Giải quyết vấn đề", "Tổ chức thông tin"]
        },
        {
          id: "g9_b3",
          lessonNumber: "Bài 3",
          name: "Bài 3. Thực hành: Đánh giá chất lượng thông tin",
          topicId: "2",
          topicName: "Chủ đề 2. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết các tiêu chí đánh giá chất lượng thông tin."
            ],
            understanding: [
              "Hiểu được sự cần thiết phải kiểm chứng thông tin trên Internet."
            ],
            application: [
              "Thực hành đánh giá độ tin cậy và chất lượng của một nguồn thông tin cụ thể."
            ]
          },
          keyConcepts: ["Đánh giá thông tin", "Chất lượng thông tin", "Tin cậy"]
        }
      ]
    },
    {
      id: "3",
      name: "Chủ đề 3. Đạo đức, pháp luật và văn hoá trong môi trường số",
      lessons: [
        {
          id: "g9_b4",
          lessonNumber: "Bài 4",
          name: "Bài 4. Một số vấn đề pháp lí về sử dụng dịch vụ Internet",
          topicId: "3",
          topicName: "Chủ đề 3. Đạo đức, pháp luật và văn hoá trong môi trường số",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được một số quy định pháp luật cơ bản liên quan đến Internet."
            ],
            understanding: [
              "Hiểu rõ trách nhiệm pháp lí khi chia sẻ, đăng tải thông tin trên mạng."
            ],
            application: [
              "Biết cách tự bảo vệ mình và tuân thủ pháp luật khi sử dụng dịch vụ Internet."
            ]
          },
          keyConcepts: ["Vấn đề pháp lí", "Dịch vụ Internet", "Luật An ninh mạng"]
        }
      ]
    },
    {
      id: "4",
      name: "Chủ đề 4. Ứng dụng tin học",
      lessons: [
        {
          id: "g9_b5",
          lessonNumber: "Bài 5",
          name: "Bài 5. Tìm hiểu phần mềm mô phỏng",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được khái niệm và mục đích của phần mềm mô phỏng."
            ],
            understanding: [
              "Giải thích được lợi ích của việc sử dụng phần mềm mô phỏng trong học tập và nghiên cứu."
            ],
            application: [
              "Sử dụng phần mềm mô phỏng để quan sát một hiện tượng thực tế."
            ]
          },
          keyConcepts: ["Phần mềm mô phỏng", "Mô phỏng"]
        },
        {
          id: "g9_b6",
          lessonNumber: "Bài 6",
          name: "Bài 6. Thực hành: Khai thác phần mềm mô phỏng",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết cách thao tác cơ bản trên một phần mềm mô phỏng cụ thể."
            ],
            understanding: [
              "Hiểu cách thay đổi thông số đầu vào và quan sát kết quả đầu ra."
            ],
            application: [
              "Thực hành khai thác dữ liệu từ một thí nghiệm mô phỏng."
            ]
          },
          keyConcepts: ["Khai thác phần mềm", "Thực hành mô phỏng"]
        },
        {
          id: "g9_b7",
          lessonNumber: "Bài 7",
          name: "Bài 7. Trình bày thông tin trong trao đổi và hợp tác",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được vai trò của trình bày thông tin khi làm việc nhóm."
            ],
            understanding: [
              "Hiểu cách thức tổ chức nội dung hợp lí, thuyết phục."
            ],
            application: [
              "Thiết kế được một cấu trúc trình bày thông tin mạch lạc, chuyên nghiệp."
            ]
          },
          keyConcepts: ["Trình bày thông tin", "Hợp tác", "Làm việc nhóm"]
        },
        {
          id: "g9_b8",
          lessonNumber: "Bài 8",
          name: "Bài 8. Thực hành: Sử dụng công cụ trực quan trình bày thông tin trong trao đổi và hợp tác",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết các công cụ trực quan hỗ trợ trình bày thông tin."
            ],
            understanding: [
              "Hiểu cách tích hợp biểu đồ, sơ đồ vào bài thuyết trình hoặc tài liệu."
            ],
            application: [
              "Thực hành tạo ra sản phẩm thông tin sử dụng yếu tố trực quan cho nhóm làm việc."
            ]
          },
          keyConcepts: ["Công cụ trực quan", "Thực hành trình bày"]
        },
        {
          id: "g9_b9a",
          lessonNumber: "Bài 9a",
          name: "Bài 9a. Sử dụng công cụ xác thực dữ liệu",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết chức năng xác thực dữ liệu (Data Validation) trong bảng tính."
            ],
            understanding: [
              "Hiểu nguyên lí thiết lập điều kiện để giới hạn dữ liệu nhập vào."
            ],
            application: [
              "Thực hành tạo danh sách thả xuống và ràng buộc dữ liệu nhập."
            ]
          },
          keyConcepts: ["Xác thực dữ liệu", "Data Validation", "Bảng tính nâng cao"]
        },
        {
          id: "g9_b10a",
          lessonNumber: "Bài 10a",
          name: "Bài 10a. Sử dụng hàm COUNTIF",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết cú pháp của hàm COUNTIF."
            ],
            understanding: [
              "Hiểu cách hàm COUNTIF hoạt động để đếm dữ liệu theo điều kiện."
            ],
            application: [
              "Áp dụng hàm COUNTIF để giải quyết một bài toán thống kê số lượng."
            ]
          },
          keyConcepts: ["Hàm COUNTIF", "Thống kê có điều kiện"]
        },
        {
          id: "g9_b11a",
          lessonNumber: "Bài 11a",
          name: "Bài 11a. Sử dụng hàm SUMIF",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết cú pháp của hàm SUMIF."
            ],
            understanding: [
              "Hiểu cách hàm SUMIF hoạt động để tính tổng theo điều kiện."
            ],
            application: [
              "Sử dụng hàm SUMIF để tổng hợp dữ liệu, tính toán tài chính đơn giản."
            ]
          },
          keyConcepts: ["Hàm SUMIF", "Tính tổng có điều kiện"]
        },
        {
          id: "g9_b12a",
          lessonNumber: "Bài 12a",
          name: "Bài 12a. Sử dụng hàm IF",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được chức năng của hàm logic IF."
            ],
            understanding: [
              "Hiểu cấu trúc điều kiện, giá trị đúng và giá trị sai trong hàm IF."
            ],
            application: [
              "Viết được biểu thức hàm IF để xử lí tình huống phân loại dữ liệu."
            ]
          },
          keyConcepts: ["Hàm IF", "Hàm logic", "Điều kiện"]
        },
        {
          id: "g9_b13a",
          lessonNumber: "Bài 13a",
          name: "Bài 13a. Hoàn thiện bảng tính quản lí tài chính gia đình",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được mục tiêu của bài toán quản lí tài chính."
            ],
            understanding: [
              "Hiểu cách kết hợp các hàm COUNTIF, SUMIF, IF để xây dựng bảng tính tổng hợp."
            ],
            application: [
              "Hoàn thiện và định dạng đẹp bảng tính quản lí thu chi thực tế."
            ]
          },
          keyConcepts: ["Quản lí tài chính", "Thực hành tổng hợp", "Bảng tính"]
        },
        {
          id: "g9_b9b",
          lessonNumber: "Bài 9b",
          name: "Bài 9b. Các chức năng chính của phần mềm làm video",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được giao diện và các khu vực làm việc của phần mềm làm video."
            ],
            understanding: [
              "Nắm được các chức năng cốt lõi: timeline, import, export, effects."
            ],
            application: [
              "Thao tác khởi tạo dự án và làm quen không gian làm việc."
            ]
          },
          keyConcepts: ["Phần mềm làm video", "Video editor", "Giao diện"]
        },
        {
          id: "g9_b10b",
          lessonNumber: "Bài 10b",
          name: "Bài 10b. Chuẩn bị dữ liệu và dựng video",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết cách thu thập hình ảnh, âm thanh, video clip nguồn."
            ],
            understanding: [
              "Hiểu quy trình kéo thả tài nguyên vào dòng thời gian (Timeline) để sắp xếp."
            ],
            application: [
              "Thực hiện cắt ghép các đoạn clip ngắn thành một trình tự logic."
            ]
          },
          keyConcepts: ["Dựng video", "Timeline", "Cắt ghép video"]
        },
        {
          id: "g9_b11b",
          lessonNumber: "Bài 11b",
          name: "Bài 11b. Thực hành: Dựng video theo kịch bản",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được kịch bản video (storyboard)."
            ],
            understanding: [
              "Hiểu sự quan trọng của việc dựng video theo tiến trình kịch bản đã lên."
            ],
            application: [
              "Thực hành dựng một video có chủ đề cụ thể bám sát kịch bản."
            ]
          },
          keyConcepts: ["Kịch bản video", "Thực hành dựng video"]
        },
        {
          id: "g9_b12b",
          lessonNumber: "Bài 12b",
          name: "Bài 12b. Hoàn thành việc dựng video",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Biết cách thêm các thành phần phụ trợ như tiêu đề, chuyển cảnh, hiệu ứng âm thanh."
            ],
            understanding: [
              "Hiểu cách điều chỉnh thời lượng và nhịp điệu video."
            ],
            application: [
              "Hoàn thiện chỉnh sửa chi tiết để nâng cao chất lượng thẩm mĩ cho video."
            ]
          },
          keyConcepts: ["Chuyển cảnh", "Hiệu ứng", "Tiêu đề video"]
        },
        {
          id: "g9_b13b",
          lessonNumber: "Bài 13b",
          name: "Bài 13b. Biên tập và xuất video",
          topicId: "4",
          topicName: "Chủ đề 4. Ứng dụng tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được các thông số quan trọng khi xuất video (độ phân giải, khung hình/giây, định dạng)."
            ],
            understanding: [
              "Hiểu quá trình render (kết xuất) video."
            ],
            application: [
              "Thực hiện xuất video ra định dạng MP4 để chia sẻ."
            ]
          },
          keyConcepts: ["Xuất video", "Render", "Định dạng MP4", "Biên tập"]
        }
      ]
    },
    {
      id: "5",
      name: "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính",
      lessons: [
        {
          id: "g9_b14",
          lessonNumber: "Bài 14",
          name: "Bài 14. Giải quyết vấn đề",
          topicId: "5",
          topicName: "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nêu được các bước cơ bản để giải quyết vấn đề bằng máy tính."
            ],
            understanding: [
              "Hiểu quá trình từ việc nhận diện bài toán đến mô phỏng giải pháp."
            ],
            application: [
              "Phân tích một bài toán thực tiễn để tìm cách giải quyết bằng công cụ máy tính."
            ]
          },
          keyConcepts: ["Giải quyết vấn đề", "Phân tích bài toán"]
        },
        {
          id: "g9_b15",
          lessonNumber: "Bài 15",
          name: "Bài 15. Bài toán tin học",
          topicId: "5",
          topicName: "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Khái niệm bài toán tin học và đặc trưng của nó."
            ],
            understanding: [
              "Mô tả được đầu vào (Input) và đầu ra (Output) của một bài toán tin học."
            ],
            application: [
              "Xác định được dữ liệu vào, ra cho một bài toán cụ thể."
            ]
          },
          keyConcepts: ["Bài toán tin học", "Input", "Output"]
        },
        {
          id: "g9_b16",
          lessonNumber: "Bài 16",
          name: "Bài 16. Thực hành: Lập chương trình máy tính",
          topicId: "5",
          topicName: "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết môi trường lập trình và các thành phần câu lệnh."
            ],
            understanding: [
              "Hiểu cách chuyển đổi thuật toán thành mã lệnh thực thi."
            ],
            application: [
              "Viết và chạy thành công một chương trình máy tính hoàn chỉnh để giải bài toán đã cho."
            ]
          },
          keyConcepts: ["Lập chương trình", "Viết mã lệnh", "Thực hành lập trình"]
        }
      ]
    },
    {
      id: "6",
      name: "Chủ đề 6. Hướng nghiệp với tin học",
      lessons: [
        {
          id: "g9_b17",
          lessonNumber: "Bài 17",
          name: "Bài 17. Tin học và thế giới nghề nghiệp",
          topicId: "6",
          topicName: "Chủ đề 6. Hướng nghiệp với tin học",
          periods: 2,
          learningOutcomes: {
            recognition: [
              "Nhận biết được sự đa dạng của các ngành nghề liên quan đến lĩnh vực tin học và CNTT."
            ],
            understanding: [
              "Hiểu những yêu cầu về kĩ năng, phẩm chất cần có để theo đuổi ngành nghề CNTT."
            ],
            application: [
              "Tự đánh giá bản thân để có hướng lựa chọn nghề nghiệp tương lai."
            ]
          },
          keyConcepts: ["Hướng nghiệp", "Nghề nghiệp CNTT"]
        }
      ]
    }
  ]
};

import { ALL_MATH_TEXTBOOKS } from "./math";

export const ALL_TEXTBOOKS: Record<string, TextbookGrade> = {
  "6": TEXTBOOK_GRADE_6,
  "7": TEXTBOOK_GRADE_7,
  "8": TEXTBOOK_GRADE_8,
  "9": TEXTBOOK_GRADE_9
};

export function getOfficialTextbookReferencePrompt(subject: string, grade: string): string {
  if (subject?.toLowerCase().trim().includes("toán")) {
    const mathTb = ALL_MATH_TEXTBOOKS[grade] || ALL_MATH_TEXTBOOKS["6"];
    let prompt = `\n=== CƠ SỞ DỮ LIỆU SGK MÔN TOÁN HỌC ${grade} CHÍNH THỨC (BỘ SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG - GDPT 2018) ===\n`;
    prompt += `Nguồn tài liệu cố định của hệ thống: ${mathTb.title}\n`;
    prompt += `Bộ sách: ${mathTb.bookSeries} - Chuẩn GDPT 2018\n`;

    mathTb.topics.forEach(topic => {
      prompt += `\n[${topic.name}]\n`;
      topic.lessons.forEach(l => {
        prompt += `- ${l.name} (${l.periods} tiết):\n`;
        prompt += `  + Yêu cầu Nhận biết: ${l.learningOutcomes.recognition.join("; ")}\n`;
        prompt += `  + Yêu cầu Thông hiểu: ${l.learningOutcomes.understanding.join("; ")}\n`;
        prompt += `  + Yêu cầu Vận dụng: ${l.learningOutcomes.application.join("; ")}\n`;
        prompt += `  + Khái niệm cốt lõi: ${l.keyConcepts.join(", ")}\n`;
      });
    });

    prompt += `\n=== HẾT DỮ LIỆU SGK MÔN TOÁN HỌC ${grade} CHÍNH THỨC ===\n`;
    prompt += `LƯU Ý ĐẶC THÙ MÔN TOÁN:\n`;
    prompt += `1. AI BẮT BUỘC biên soạn câu hỏi và bài tập bám sát tuyệt đối các yêu cầu cần đạt và khái niệm cốt lõi của từng bài học SGK Toán ${grade} Kết nối tri thức ở trên.\n`;
    prompt += `2. Các công thức toán học phải được định dạng chuẩn LaTeX rõ ràng, số liệu bài toán phải chính xác, tính toán logic và không có sai số hoặc mâu thuẫn.\n`;
    return prompt;
  }

  if (subject !== "Tin học") {
    return `\n=== CƠ SỞ DỮ LIỆU CHƯƠNG TRÌNH MÔN ${subject.toUpperCase()} ${grade} (GDPT 2018) ===\n
Nguồn tài liệu: Dữ liệu chương trình môn ${subject} ${grade} theo chuẩn bộ GDĐT.
\n=== HẾT DỮ LIỆU ===\n`;
  }

  const tb = ALL_TEXTBOOKS[grade] || TEXTBOOK_GRADE_8;
  let prompt = `\n=== CƠ SỞ DỮ LIỆU SGK ${subject.toUpperCase()} ${grade} CHÍNH THỨC (BỘ SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG - GDPT 2018) ===\n`;
  prompt += `Nguồn tài liệu cố định của hệ thống: ${tb.title}\n`;
  
  tb.topics.forEach(topic => {
    prompt += `\n[${topic.name}]\n`;
    topic.lessons.forEach(l => {
      prompt += `- ${l.name} (${l.periods} tiết):\n`;
      prompt += `  + Yêu cầu Nhận biết: ${l.learningOutcomes.recognition.join("; ")}\n`;
      prompt += `  + Yêu cầu Thông hiểu: ${l.learningOutcomes.understanding.join("; ")}\n`;
      prompt += `  + Yêu cầu Vận dụng: ${l.learningOutcomes.application.join("; ")}\n`;
      prompt += `  + Khái niệm cốt lõi: ${l.keyConcepts.join(", ")}\n`;
    });
  });
  
  prompt += `\n=== HẾT DỮ LIỆU SGK ${subject.toUpperCase()} ${grade} CHÍNH THỨC ===\n`;
  prompt += `LƯU Ý: AI BẮT BUỘC trích xuất kiến thức và câu hỏi bám sát tuyệt đối dữ liệu SGK chính thức trên. Tuyệt đối không lấy kiến thức ngoài luồng.\n`;
  return prompt;
}

export function getFilteredTextbookReferencePrompt(subject: string, grade: string, selectedLessonIds: string[]): string {
  const selectedSet = new Set(selectedLessonIds.map(id => String(id).trim()));

  if (subject?.toLowerCase().trim().includes("toán")) {
    const mathTb = ALL_MATH_TEXTBOOKS[grade] || ALL_MATH_TEXTBOOKS["6"];
    let prompt = `\n=== CƠ SỞ DỮ LIỆU SGK MÔN TOÁN HỌC ${grade} CHÍNH THỨC (BỘ SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG - GDPT 2018) ===\n`;
    prompt += `Nguồn tài liệu cố định của hệ thống: ${mathTb.title}\n`;
    prompt += `Bộ sách: ${mathTb.bookSeries} - Chuẩn GDPT 2018\n`;

    mathTb.topics.forEach(topic => {
      const filteredLessons = topic.lessons.filter(l => selectedSet.has(String(l.id).trim()));
      if (filteredLessons.length > 0) {
        prompt += `\n[${topic.name}]\n`;
        filteredLessons.forEach(l => {
          prompt += `- ${l.name} (${l.periods} tiết):\n`;
          prompt += `  + Yêu cầu Nhận biết: ${l.learningOutcomes.recognition.join("; ")}\n`;
          prompt += `  + Yêu cầu Thông hiểu: ${l.learningOutcomes.understanding.join("; ")}\n`;
          prompt += `  + Yêu cầu Vận dụng: ${l.learningOutcomes.application.join("; ")}\n`;
          prompt += `  + Khái niệm cốt lõi: ${l.keyConcepts.join(", ")}\n`;
        });
      }
    });

    prompt += `\n=== HẾT DỮ LIỆU SGK MÔN TOÁN HỌC ${grade} CHÍNH THỨC ===\n`;
    prompt += `LƯU Ý ĐẶC THÙ MÔN TOÁN:\n`;
    prompt += `1. AI BẮT BUỘC biên soạn câu hỏi và bài tập bám sát tuyệt đối các yêu cầu cần đạt và khái niệm cốt lõi của từng bài học SGK Toán ${grade} Kết nối tri thức ở trên.\n`;
    prompt += `2. Các công thức toán học phải được định dạng chuẩn LaTeX rõ ràng, số liệu bài toán phải chính xác, tính toán logic và không có sai số hoặc mâu thuẫn.\n`;
    return prompt;
  }

  if (subject !== "Tin học") {
    return `\n=== CƠ SỞ DỮ LIỆU CHƯƠNG TRÌNH MÔN ${subject.toUpperCase()} ${grade} (GDPT 2018) ===\n
Nguồn tài liệu: Dữ liệu chương trình môn ${subject} ${grade} theo chuẩn bộ GDĐT.
\n=== HẾT DỮ LIỆU ===\n`;
  }

  const tb = ALL_TEXTBOOKS[grade] || TEXTBOOK_GRADE_8;
  let prompt = `\n=== CƠ SỞ DỮ LIỆU SGK ${subject.toUpperCase()} ${grade} CHÍNH THỨC (BỘ SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG - GDPT 2018) ===\n`;
  prompt += `Nguồn tài liệu cố định của hệ thống: ${tb.title}\n`;
  
  tb.topics.forEach(topic => {
    const filteredLessons = topic.lessons.filter(l => selectedSet.has(String(l.id).trim()));
    if (filteredLessons.length > 0) {
      prompt += `\n[${topic.name}]\n`;
      filteredLessons.forEach(l => {
        prompt += `- ${l.name} (${l.periods} tiết):\n`;
        prompt += `  + Yêu cầu Nhận biết: ${l.learningOutcomes.recognition.join("; ")}\n`;
        prompt += `  + Yêu cầu Thông hiểu: ${l.learningOutcomes.understanding.join("; ")}\n`;
        prompt += `  + Yêu cầu Vận dụng: ${l.learningOutcomes.application.join("; ")}\n`;
        prompt += `  + Khái niệm cốt lõi: ${l.keyConcepts.join(", ")}\n`;
      });
    }
  });
  
  prompt += `\n=== HẾT DỮ LIỆU SGK ${subject.toUpperCase()} ${grade} CHÍNH THỨC ===\n`;
  prompt += `LƯU Ý: AI BẮT BUỘC trích xuất kiến thức và câu hỏi bám sát tuyệt đối dữ liệu SGK chính thức trên. Tuyệt đối không lấy kiến thức ngoài luồng.\n`;
  return prompt;
}
