/**
 * Chuyển các div (được truyền vào theo mảng id) thành <tr> trong bảng.
 * @param {string} tableSelector - CSS selector của bảng đích (ví dụ "#Results_Table")
 * @param {string[]} fieldIds - Mảng các id của div cần chuyển (ví dụ ["Results_NumAField", "Results_NumBField"])
 */
function moveSpecificDivFieldsIntoTable(tableSelector, fieldIds = []) {
    const input = document.getElementById("JoinedSites");
    const currentSiteId = document.getElementById("SiteId")?.value;
    let joinedSites;
    try {
        joinedSites = JSON.parse(input.value.replace(/&quot;/g, '"'));
    } catch {
        return;
    }
    const noteSite = joinedSites.find(
        (site) => site.ReferenceType === "Results" && site.Title === _1171NOTETITLE
    );
    console.log("noteSite", noteSite);
    console.log("currentSiteId", currentSiteId);
    if (noteSite.SiteId != currentSiteId) {
        return;
    }

    const baseUrl = window.location.href.split("?")[0];
    if (!baseUrl.endsWith("/new") && !baseUrl.endsWith("/edit")) {
        return;
    }
    console.log("Đang ở trang tạo mới hoặc chỉnh sửa");
    addCustomButton();

    const table = document.querySelector(tableSelector);
    if (!table) {
        console.warn("⚠️ Không tìm thấy bảng:", tableSelector);
        return;
    }

    if (!Array.isArray(fieldIds) || fieldIds.length === 0) {
        console.warn("⚠️ Bạn chưa truyền danh sách id hợp lệ.");
        return;
    }

    fieldIds.forEach((id) => {
        const div = document.getElementById(id);
        if (!div) {
            console.warn(`⚠️ Không tìm thấy div có id: ${id}`);
            return;
        }

        // Lấy label
        const labelEl = div.querySelector("label");
        const labelText = labelEl ? labelEl.textContent.trim() : "";

        // Lấy nội dung control (input, select, span,...)
        const controlEl = div.querySelector(".field-control");
        const controlHTML = controlEl ? controlEl.innerHTML : "";

        // Tạo tr mới
        const tr = document.createElement("tr");
        if (labelText) {
            tr.innerHTML = `
      <td style="border:1px solid #ccc; padding:6px; width:25%; background:#f9f9f9;">
        <strong>${labelText}</strong>
      </td>
      <td style="border:1px solid #ccc; padding:6px; width:75%;">
      <div class="field-control" style="padding-top:0">${controlHTML}</div>
      </td>
    `;
        } else {
            tr.innerHTML = `
      <td colspan="2" style="border:1px solid #ccc; padding:6px; width:100%;">
      <div class="field-control" style="padding-top:0">${controlHTML}</div>
      </td>
    `;
        }

        // Chèn vào bảng
        table.appendChild(tr);

        // Ẩn hoặc xóa div gốc
        // div.style.display = "none";
        div.remove();
    });

    console.log(
        `✅ Đã chuyển ${fieldIds.length} field vào bảng ${tableSelector}`
    );
}

function addCustomButton() {
  const mainCommands = document.getElementById("MainCommands");
  if (!mainCommands) {
    console.warn("⚠️ Không tìm thấy phần tử #MainCommands");
    return;
  }

  // 🔘 Tạo button mới
  const addButton = document.createElement("button");
  addButton.id = "addTemplate1711";
  addButton.type = "button";
  addButton.className =
    "button button-icon button-positive ui-button ui-corner-all ui-widget applied";
  addButton.dataset.icon = "ui-icon-plus"; // có thể chọn icon khác nếu muốn
  addButton.innerHTML = `
    <span class="ui-button-icon ui-icon ui-icon-plus"></span>
    <span class="ui-button-icon-space"> </span>
    テンプレート反映
  `;

  // 🔧 Gắn hành động khi click (bạn có thể thay đổi tuỳ ý)
  addButton.addEventListener("click", () => {
    console.log("🟢 Button ADD clicked!");
    // Ví dụ: gọi hàm custom
    // addTemplateHandler();
    getTableValues()
  });

  // ➕ Thêm nút vào cuối div
  mainCommands.appendChild(addButton);

  console.log("✅ Nút ADD (id=addTemplate1711) đã được thêm vào MainCommands");
}

function getTableValues() {
  // if checkbox id Results_CheckA checked, then run the code below
  const checkBox = document.getElementById("Results_CheckA");
  if (checkBox.checked) {
    console.log("⚪ Checkbox chưa được chọn, không thực hiện tiếp.");
    return;
  }
  // do bảng tạo bằng js nên cần đợi 1 chút để bảng render xong
  const table = document.querySelector("#Results_JobInfo table");
  if (!table) {
    console.warn("⚠️ Không tìm thấy bảng nào trong trang.");
    return;
  }

  // 🔹 Lấy tất cả các input, select, và checkbox bên trong bảng
  const inputs = table.querySelectorAll("input, select");

  // 🔹 Tạo mảng để lưu giá trị
  const values = [];

  inputs.forEach((el) => {
    let value = "";

    if (el.tagName.toLowerCase() === "input") {
      // if (el.type !== "checkbox") {
      //   value = el.value?.trim() || "";
      // }
      value = ''
    } else if (el.tagName.toLowerCase() === "select") {
      // Lấy text của option đang chọn
      const selectedOption = el.options[el.selectedIndex];
      value = selectedOption ? selectedOption.text.trim() : "";
    }

    // Chỉ thêm nếu có dữ liệu
    if (value !== "") values.push(value);
  });

  const resultString = values.join("");
  // #Results_DescriptionA
  const descriptionField = document.getElementById("Results_DescriptionA");
  if (descriptionField) {
    descriptionField.value = resultString;
  }

  console.log("📋 Chuỗi kết quả:");
  console.log(resultString);

  // 🔧 Có thể gán vào input ẩn, hoặc copy ra clipboard:
  // navigator.clipboard.writeText(resultString);
}