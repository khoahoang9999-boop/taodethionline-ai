export interface MathObjectivesData {
  knowledge: {
    title: string;
    arithmetic: string;
    geometry: string;
    statistics?: string;
  };
  competencies: string[];
  qualities: string[];
}

export function getMathStandardObjectives(grade: string, period: string): MathObjectivesData {
  const isFinal = (period || "").toLowerCase().includes("cuối");
  const isTerm2 = (period || "").toLowerCase().includes("ii") || (period || "").toLowerCase().includes("2");

  if (grade === "6") {
    if (!isTerm2 && isFinal) {
      // Cuối học kì 1 Lớp 6
      return {
        knowledge: {
          title: "Kiểm tra kiến thức hs sau khi đã học xong học kì 1 của năm học; qua đó đánh giá kết quả và điều chỉnh cách dạy và học trong học kì 2; cụ thể kiểm tra mức độ nhận thức về",
          arithmetic: "Số tự nhiên và tập hợp các số tự nhiên. Thứ tự trong tập hợp các số tự nhiên. Các phép tính với số tự nhiên. Phép tính luỹ thừa với số mũ tự nhiên. Tính chia hết trong tập hợp các số tự nhiên. Số nguyên tố. Ước chung và bội chung. Số nguyên âm và tập hợp các số nguyên. Thứ tự trong tập hợp các số nguyên. Các phép tính với số nguyên. Tính chia hết trong tập hợp các số nguyên.",
          geometry: "Tam giác đều, hình vuông, lục giác đều. Hình chữ nhật, hình thoi, hình bình hành, hình thang cân. Hình có trục đối xứng. Hình có tâm đối xứng. Vai trò của đối xứng trong thế giới tự nhiên."
        },
        competencies: [
          "Nhận biết được tập hợp các số tự nhiên, thứ tự thực hiện các phép tính, quan hệ chia hết, khái niệm ước và bội.",
          "Xác định được ước chung, ước chung lớn nhất; xác định được bội chung, bội chung nhỏ nhất của hai hoặc ba số tự nhiên; thực hiện được phép cộng, phép trừ phân số bằng cách sử dụng ước chung lớn nhất, bội chung nhỏ nhất.",
          "Vận dụng được kiến thức số học vào giải quyết những vấn đề thực tiễn (đơn giản, quen thuộc) (ví dụ: tính toán tiền hay lượng hàng hoá khi mua sắm, xác định số đồ vật cần thiết để sắp xếp chúng theo những quy tắc cho trước,...).",
          "Vận dụng được các tính chất giao hoán, kết hợp, phân phối của phép nhân đối với phép cộng, quy tắc dấu ngoặc trong tập hợp các số nguyên trong tính toán (tính viết và tính nhẩm, tính nhanh một cách hợp lí).",
          "Nhận dạng được tam giác đều, hình vuông, lục giác đều.",
          "Mô tả được một số yếu tố cơ bản (cạnh, góc, đường chéo) của: tam giác đều (ví dụ: ba cạnh bằng nhau, ba góc bằng nhau); hình vuông (ví dụ: bốn cạnh bằng nhau, mỗi góc là góc vuông, hai đường chéo bằng nhau); lục giác đều (ví dụ: sáu cạnh bằng nhau, sáu góc bằng nhau, ba đường chéo chính bằng nhau).",
          "Giải quyết được một số vấn đề thực tiễn (đơn giản, quen thuộc) gắn với việc tính chu vi và diện tích của các hình đặc biệt nói trên (ví dụ: tính chu vi hoặc diện tích của một số đối tượng có dạng đặc biệt nói trên,...).",
          "Nhận biết được tính đối xứng trong Toán học, tự nhiên, nghệ thuật, kiến trúc, công nghệ chế tạo,..."
        ],
        qualities: [
          "Trung thực: trong học tập và kiểm tra đánh giá.",
          "Trách nhiệm trong học tập và kiểm tra đánh giá.",
          "Chăm chỉ trong quá trình học tập."
        ]
      };
    } else if (!isTerm2 && !isFinal) {
      // Giữa học kì 1 Lớp 6
      return {
        knowledge: {
          title: "Kiểm tra kiến thức hs sau khi kết thúc nội dung nửa đầu học kì 1; qua đó đánh giá kết quả học tập và điều chỉnh phương pháp dạy học; cụ thể kiểm tra mức độ nhận thức về",
          arithmetic: "Tập hợp các số tự nhiên. Các phép tính cộng, trừ, nhân, chia và luỹ thừa với số mũ tự nhiên. Thứ tự thực hiện các phép tính. Quan hệ chia hết và tính chất chia hết. Dấu hiệu chia hết cho 2, cho 5, cho 3, cho 9. Số nguyên tố, hợp số. Phân tích một số ra thừa số nguyên tố. Ước chung và bội chung.",
          geometry: "Hình học trực quan: Tam giác đều, hình vuông, lục giác đều. Hình chữ nhật, hình thoi, hình bình hành, hình thang cân. Chu vi và diện tích một số hình phẳng đã học."
        },
        competencies: [
          "Nhận biết được tập hợp các số tự nhiên, các phần tử của tập hợp, thứ tự thực hiện các phép tính trong tập số tự nhiên.",
          "Thực hiện thành thạo các phép tính số học, áp dụng tính chất chia hết và dấu hiệu chia hết để giải quyết các bài toán số học cơ bản.",
          "Tìm được ước chung, bội chung, ƯCLN, BCNN của hai hay nhiều số trong các bài toán thực tế.",
          "Nhận dạng và mô tả được các yếu tố cơ bản của tam giác đều, hình vuông, lục giác đều, hình chữ nhật, hình thoi, hình thang cân.",
          "Vận dụng công thức tính chu vi, diện tích các hình phẳng vào bài toán thực tiễn đơn giản."
        ],
        qualities: [
          "Trung thực: trong học tập và kiểm tra đánh giá.",
          "Trách nhiệm trong học tập và kiểm tra đánh giá.",
          "Chăm chỉ trong quá trình học tập."
        ]
      };
    } else {
      // Học kì 2 Lớp 6
      return {
        knowledge: {
          title: "Kiểm tra kiến thức hs theo chương trình Toán 6 Học kì 2; đánh giá năng lực nhận thức về",
          arithmetic: "Phân số, các phép tính với phân số; Số thập phân và các phép tính với số thập phân; Tỉ số và tỉ số phần trăm; Dữ liệu và xác suất thực nghiệm.",
          geometry: "Hình học trực quan: Điểm, đường thẳng, tia, đoạn thẳng, độ dài đoạn thẳng, trung điểm của đoạn thẳng; Góc, số đo góc, các góc đặc biệt."
        },
        competencies: [
          "Thực hiện thành thạo các phép tính về phân số, số thập phân và các bài toán tỉ số phần trăm.",
          "Thu thập, tổ chức, biểu diễn và phân tích dữ liệu thống kê đơn giản; tính xác suất thực nghiệm trong một số trò chơi quen thuộc.",
          "Nhận biết và vẽ được điểm, đường thẳng, tia, đoạn thẳng, góc; đo và so sánh góc, tính độ dài đoạn thẳng."
        ],
        qualities: [
          "Trung thực: trong học tập và kiểm tra đánh giá.",
          "Trách nhiệm trong học tập và kiểm tra đánh giá.",
          "Chăm chỉ trong quá trình học tập."
        ]
      };
    }
  }

  if (grade === "7") {
    return {
      knowledge: {
        title: "Kiểm tra kiến thức hs theo chương trình Toán 7 GDPT 2018; đánh giá mức độ nhận thức về",
        arithmetic: "Số hữu tỉ, các phép tính trong tập hợp số hữu tỉ; Số thực, căn bậc hai số học, giá trị tuyệt đối của số thực; Tỉ lệ thức và dãy tỉ số bằng nhau; Đại lượng tỉ lệ thuận, đại lượng tỉ lệ nghịch; Biểu thức đại số và đa thức một biến.",
        geometry: "Góc ở vị trí đặc biệt, tia phân giác; Hai đường thẳng song song và dấu hiệu nhận biết; Tam giác bằng nhau, tam giác cân; Quan hệ giữa các yếu tố trong tam giác, các đường đồng quy.",
        statistics: "Thu thập, phân loại và biểu diễn dữ liệu; Biểu đồ hình quạt tròn, biểu đồ đoạn thẳng; Biến cố và xác suất của biến cố."
      },
      competencies: [
        "Thực hiện thành thạo các phép tính với số hữu tỉ, số thực; vận dụng dãy tỉ số bằng nhau vào giải toán thực tiễn.",
        "Chứng minh hai tam giác bằng nhau, tính số đo góc, chứng minh song song và quan hệ đồng quy trong tam giác.",
        "Đọc, phân tích dữ liệu trên các loại biểu đồ và tính xác suất của biến cố ngẫu nhiên."
      ],
      qualities: [
        "Trung thực: trong học tập và kiểm tra đánh giá.",
        "Trách nhiệm trong học tập và kiểm tra đánh giá.",
        "Chăm chỉ trong quá trình học tập."
      ]
    };
  }

  if (grade === "8") {
    return {
      knowledge: {
        title: "Kiểm tra kiến thức hs theo chương trình Toán 8 GDPT 2018; đánh giá mức độ nhận thức về",
        arithmetic: "Đa thức nhiều biến, các phép tính với đa thức; Hằng đẳng thức đáng nhớ; Phân tích đa thức thành nhân tử; Phân thức đại số và các phép tính; Hàm số bậc nhất và đồ thị.",
        geometry: "Tứ giác: Hình thang cân, hình bình hành, hình chữ nhật, hình thoi, hình vuông; Định lí Thalès trong tam giác; Tam giác đồng dạng; Hình đồng dạng; Hình khối trong thực tiễn.",
        statistics: "Thu thập và phân loại dữ liệu; Mô tả và biểu diễn dữ liệu trên các bảng, biểu đồ; Xác suất của biến cố ngẫu nhiên."
      },
      competencies: [
        "Vận dụng thành thạo hằng đẳng thức, phân tích đa thức thành nhân tử và rút gọn biểu thức đại số.",
        "Vận dụng định lí Thalès, tính chất tam giác đồng dạng và các tứ giác đặc biệt để giải quyết các bài toán hình học và thực tiễn.",
        "Biểu diễn, phân tích dữ liệu thống kê và tính xác suất thực tế."
      ],
      qualities: [
        "Trung thực: trong học tập và kiểm tra đánh giá.",
        "Trách nhiệm trong học tập và kiểm tra đánh giá.",
        "Chăm chỉ trong quá trình học tập."
      ]
    };
  }

  // Mặc định cho Lớp 9
  return {
    knowledge: {
      title: "Kiểm tra kiến thức hs theo chương trình Toán 9 GDPT 2018; đánh giá mức độ nhận thức về",
      arithmetic: "Phương trình và hệ hai phương trình bậc nhất hai ẩn; Phương trình bậc hai một ẩn và định lí Viète; Căn bậc hai và căn bậc ba; Hàm số y = ax².",
      geometry: "Hệ thức lượng trong tam giác vuông; Đường tròn, vị trí tương đối của đường thẳng và đường tròn, đường tròn và đường tròn; Góc với đường tròn; Hình trụ, hình nón, hình cầu.",
      statistics: "Bảng tần số, biểu đồ tần số; Bảng tần số tương đối, biểu đồ tần số tương đối; Xác suất của biến cố trong các mô hình xác suất đơn giản."
    },
    competencies: [
      "Giải phương trình, hệ phương trình và ứng dụng giải bài toán bằng cách lập phương trình/hệ phương trình.",
      "Vận dụng hệ thức lượng trong tam giác vuông, các định lí về góc với đường tròn và tứ giác nội tiếp để giải toán hình học.",
      "Phân tích dữ liệu tần số, xác suất và giải các bài toán thực tiễn."
    ],
    qualities: [
      "Trung thực: trong học tập và kiểm tra đánh giá.",
      "Trách nhiệm trong học tập và kiểm tra đánh giá.",
      "Chăm chỉ trong quá trình học tập."
    ]
  };
}

/**
 * Standard detail criteria dictionary for Math THCS topics
 */
export const MATH_SPECIFICATION_DETAILS: Record<string, { nb: string; th: string; vd: string }> = {
  // Lớp 6 - Số tự nhiên
  "so_tu_nhien_tap_hop": {
    nb: "– Nhận biết được tập hợp các số tự nhiên.\n– Nhận biết được các phần tử thuộc hoặc không thuộc một tập hợp.",
    th: "– Biểu diễn được số tự nhiên trong hệ thập phân.\n– Biểu diễn được các số tự nhiên từ 1 đến 30 bằng cách sử dụng các chữ số La Mã.",
    vd: "– Sử dụng được thuật ngữ tập hợp, phần tử thuộc (không thuộc) một tập hợp; sử dụng được cách cho tập hợp.\n– Vận dụng được thứ tự trong tập hợp các số tự nhiên để so sánh và giải quyết bài toán thực tế."
  },
  "cac_phep_tinh_so_tu_nhien": {
    nb: "– Nhận biết được thứ tự thực hiện các phép tính trong tập hợp các số tự nhiên.\n– Nhận biết được định nghĩa và tính chất cơ bản của luỹ thừa với số mũ tự nhiên.",
    th: "– Thực hiện được các phép tính: cộng, trừ, nhân, chia trong tập hợp số tự nhiên.\n– Thực hiện được phép tính luỹ thừa với số mũ tự nhiên; nhân và chia hai luỹ thừa cùng cơ số.",
    vd: "– Vận dụng được các tính chất giao hoán, kết hợp, phân phối của phép nhân đối với phép cộng trong tính toán (tính viết và tính nhẩm, tính nhanh một cách hợp lí).\n– Giải quyết được các bài toán thực tiễn gắn liền với các phép tính số học."
  },
  "tinh_chia_het_ucln_bcnn": {
    nb: "– Nhận biết được quan hệ chia hết, khái niệm ước và bội trong tập hợp số tự nhiên.\n– Nhận biết được khái niệm số nguyên tố, hợp số.\n– Nhận biết được các dấu hiệu chia hết cho 2, cho 5, cho 3, cho 9.",
    th: "– Phân tích được một hợp số ra thừa số nguyên tố trong những trường hợp đơn giản.\n– Xác định được ước chung, ước chung lớn nhất (ƯCLN); xác định được bội chung, bội chung nhỏ nhất (BCNN) của hai hoặc ba số tự nhiên.",
    vd: "– Vận dụng được dấu hiệu chia hết, ƯCLN và BCNN để giải quyết một số bài toán thực tiễn đơn giản (chia nhóm, xếp hàng, tính lịch chu kì,...)."
  },
  // Lớp 6 - Số nguyên
  "so_nguyen_am_tap_hop": {
    nb: "– Nhận biết được số nguyên âm, tập hợp các số nguyên.\n– Nhận biết được số đối của một số nguyên.\n– Nhận biết được thứ tự trong tập hợp các số nguyên.",
    th: "– Biểu diễn được các số nguyên trên trục số.\n– So sánh được hai số nguyên cho trước.",
    vd: "– Vận dụng được số nguyên âm vào việc mô tả một số tình huống thực tiễn (nhiệt độ dưới 0°C, độ cao dưới mực nước biển, số tiền nợ, lỗ,...)."
  },
  "cac_phep_tinh_so_nguyen": {
    nb: "– Nhận biết được quy tắc cộng, trừ, nhân, chia hai số nguyên cùng dấu và khác dấu.\n– Nhận biết được quan hệ chia hết, ước và bội trong tập hợp số nguyên.",
    th: "– Thực hiện được các phép tính cộng, trừ, nhân, chia hai số nguyên.\n– Vận dụng được quy tắc dấu ngoặc khi thực hiện phép tính.",
    vd: "– Vận dụng được các tính chất của phép toán và quy tắc dấu ngoặc để tính toán hợp lí, tính nhanh.\n– Giải quyết được một số vấn đề thực tiễn gắn với các phép tính trên tập hợp số nguyên."
  },
  // Lớp 6 - Hình học
  "hinh_hoc_truc_quan_tam_giac_vuong_luc_giac": {
    nb: "– Nhận dạng được tam giác đều, hình vuông, lục giác đều trong thực tế.",
    th: "– Mô tả được một số yếu tố cơ bản (cạnh, góc, đường chéo) của tam giác đều, hình vuông, lục giác đều.\n– Vẽ được tam giác đều, hình vuông bằng thước và compa.",
    vd: "– Tạo lập được tam giác đều, hình vuông, lục giác đều bằng cách gấp giấy hoặc ghép hình.\n– Vận dụng tính chất hình học giải quyết các tình huống thực tế."
  },
  "hinh_chu_nhat_thoi_binh_hanh_thang_can": {
    nb: "– Nhận dạng được hình chữ nhật, hình thoi, hình bình hành, hình thang cân trong đời sống.",
    th: "– Mô tả được một số yếu tố cơ bản (cạnh, góc, đường chéo) của hình chữ nhật, hình thoi, hình bình hành, hình thang cân.\n– Vẽ được hình chữ nhật, hình thoi bằng thước và êke.",
    vd: "– Giải quyết được một số vấn đề thực tiễn gắn với việc tính chu vi và diện tích của hình chữ nhật, hình thoi, hình bình hành, hình thang cân (tính diện tích mảnh vườn, lát gạch sân,...)."
  },
  "hinh_co_truc_tam_doi_xung": {
    nb: "– Nhận biết được hình có trục đối xứng, hình có tâm đối xứng trong hình học và tự nhiên.",
    th: "– Xác định được trục đối xứng, tâm đối xứng của một số hình phẳng quen thuộc (hình tròn, tam giác đều, hình vuông, hình chữ nhật, hình thoi,...).",
    vd: "– Nhận biết được tính đối xứng trong nghệ thuật, kiến trúc, công nghệ chế tạo; thiết kế được một số hoa văn có tính đối xứng đơn giản."
  }
};

/**
 * Ensures specification criteria text is fully expanded and pedagogical
 */
export function enrichSpecificationItem(content: string, topic: string, nb_desc?: string, th_desc?: string, vd_desc?: string) {
  const norm = (content + " " + topic).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  let foundMatch: { nb: string; th: string; vd: string } | null = null;

  if (norm.includes("so tu nhien") && norm.includes("tap hop")) {
    foundMatch = MATH_SPECIFICATION_DETAILS["so_tu_nhien_tap_hop"];
  } else if (norm.includes("phep tinh") && norm.includes("tu nhien") || norm.includes("luy thua")) {
    foundMatch = MATH_SPECIFICATION_DETAILS["cac_phep_tinh_so_tu_nhien"];
  } else if (norm.includes("chia het") || norm.includes("ucln") || norm.includes("bcnn") || norm.includes("nguyen to") || norm.includes("uoc") || norm.includes("boi")) {
    foundMatch = MATH_SPECIFICATION_DETAILS["tinh_chia_het_ucln_bcnn"];
  } else if (norm.includes("so nguyen am") || (norm.includes("so nguyen") && norm.includes("tap hop"))) {
    foundMatch = MATH_SPECIFICATION_DETAILS["so_nguyen_am_tap_hop"];
  } else if (norm.includes("phep tinh") && norm.includes("so nguyen")) {
    foundMatch = MATH_SPECIFICATION_DETAILS["cac_phep_tinh_so_nguyen"];
  } else if (norm.includes("tam giac deu") || norm.includes("hinh vuong") || norm.includes("luc giac")) {
    foundMatch = MATH_SPECIFICATION_DETAILS["hinh_hoc_truc_quan_tam_giac_vuong_luc_giac"];
  } else if (norm.includes("hinh chu nhat") || norm.includes("hinh thoi") || norm.includes("binh hanh") || norm.includes("thang can")) {
    foundMatch = MATH_SPECIFICATION_DETAILS["hinh_chu_nhat_thoi_binh_hanh_thang_can"];
  } else if (norm.includes("doi xung")) {
    foundMatch = MATH_SPECIFICATION_DETAILS["hinh_co_truc_tam_doi_xung"];
  }

  // If matched and existing desc is short or generic, replace/enrich
  const isShortOrGeneric = (d?: string) => !d || d.length < 35 || d.includes("Nhận biết kiến thức") || d.includes("Thông hiểu kiến thức") || d.includes("Vận dụng giải bài tập");

  return {
    nb: (foundMatch && isShortOrGeneric(nb_desc)) ? foundMatch.nb : (nb_desc || ""),
    th: (foundMatch && isShortOrGeneric(th_desc)) ? foundMatch.th : (th_desc || ""),
    vd: (foundMatch && isShortOrGeneric(vd_desc)) ? foundMatch.vd : (vd_desc || "")
  };
}

