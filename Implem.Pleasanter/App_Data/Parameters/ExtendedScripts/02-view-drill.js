async function initDrillHoleSiteInfo() {
    const input = document.getElementById("JoinedSites");
    const currentSiteId = document.getElementById("SiteId")?.value;
    if (!input) return;

    let joinedSites;
    try {
        joinedSites = JSON.parse(input.value.replace(/&quot;/g, '"'));
    } catch {
        return;
    }
    const drillHoleSite = joinedSites.find(
        (site) =>
            site.ReferenceType === "Results" && site.Title === _1171DRILLINGHOLETITLE
    );
    const jobSite = joinedSites.find(
        (site) => site.ReferenceType === "Issues" && site.Title === _1171JOBTITLE
    );
    // if all siteId not equal currentSiteId or jobSite equal currentSiteId, return
    const isAllNotEqual = joinedSites.every(
        (site) => site.SiteId != currentSiteId
    );
    if (!drillHoleSite || isAllNotEqual || jobSite.SiteId == currentSiteId) {
        return;
    }

    if (currentSiteId == drillHoleSite.SiteId) {
        ["Results_TitleField", "Results_NumAField", "Results_VerField"].forEach(
            (id) => {
                const elem = document.getElementById(id);
                if (elem) {
                    elem.remove();
                }
            }
        );
    }

    const row = await callApiGetDrillHole(drillHoleSite.SiteId);

    // ✅ Tìm bảng JOB (đã tạo trước trong initJobSiteInfo)
    const jobTable = document.querySelector("#Results_JobInfo table");
    if (!jobTable) {
      console.warn("⚠️ Job table not found. Drill hole row not added.");
      return;
    }

    // ✅ Tạo dòng mới (tr) cho ボーリング連番
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td colspan="2" style="border: 1px solid #ccc; padding: 6px;">
        <strong>ボーリング連番:</strong> ${row["ボーリング連番"] || ""}
      </td>
    `;

    // ✅ Thêm dòng này vào cuối bảng
    jobTable.appendChild(tr);
}

