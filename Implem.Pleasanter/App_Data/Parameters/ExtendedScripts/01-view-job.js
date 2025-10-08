async function initJobSiteInfo() {
    const input = document.getElementById("JoinedSites");
    const currentSiteId = document.getElementById("SiteId")?.value;
    if (!input || !currentSiteId || currentSiteId == 0) {
        return;
    }

    let joinedSites;
    try {
        joinedSites = JSON.parse(input.value.replace(/&quo;t;/g, '"'));
    } catch (e) {
        console.error("Error parsing JoinedSites:", e);
        return;
    }

    const jobSite = joinedSites.find(
        (site) => site.ReferenceType === "Issues" && site.Title === _1171JOBTITLE
    );
    // if all siteId not equal currentSiteId or jobSite equal currentSiteId, return
    const isAllNotEqual = joinedSites.every(
        (site) => site.SiteId != currentSiteId
    );
    if (!jobSite || isAllNotEqual || jobSite.SiteId == currentSiteId) {
        return;
    }

    const row = await callApiGetJob(jobSite.SiteId);

    const tabPanel = document.querySelector(".tabs-panel-inner");
    if (!tabPanel) return;

    const tableDiv = document.createElement("div");
    tableDiv.id = "Results_JobInfo";
    tableDiv.className = "field-wide";
    tableDiv.innerHTML = `
      <table style="width:100%; border-collapse: collapse; margin-top: 8px; font-size: 14px;">
        <tr>
          <td style="border: 1px solid #ccc; padding: 6px; width: 50%;">
            ${row["JOB番号"] || ""}
          </td>
          <td style="border: 1px solid #ccc; padding: 6px; width: 50%;">
            ${row["成約番号"] || ""}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="border: 1px solid #ccc; padding: 6px;">
            ${row["略件名"] || ""}
          </td>
        </tr>
      </table>
    `;

    // Chèn vào đầu tabPanel
    tabPanel.insertBefore(tableDiv, tabPanel.firstChild);
}

