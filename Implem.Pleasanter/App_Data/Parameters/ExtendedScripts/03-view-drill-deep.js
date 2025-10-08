async function initDrillingDeepSiteInfo() {
    const input = document.getElementById("JoinedSites");
    const currentSiteId = document.getElementById("SiteId")?.value;

    if (!input) return;

    let joinedSites;
    try {
        joinedSites = JSON.parse(input.value.replace(/&quot;/g, '"'));
    } catch {
        return;
    }

    const drillDeepSite = joinedSites.find(
        (site) =>
            site.ReferenceType === "Results" && site.Title === _1171DRILLINGDEEPTITLE
    );
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
    if (
        !drillDeepSite ||
        isAllNotEqual ||
        jobSite.SiteId == currentSiteId ||
        drillHoleSite.SiteId == currentSiteId ||
        currentSiteId == drillDeepSite.SiteId
    ) {
        return;
    }
    try {
        const row = await callApiGetDrillingDeep(drillDeepSite.SiteId);

        // ✅ Tìm bảng JOB đã tạo từ trước
        const jobTable = document.querySelector("#Results_JobInfo table");
        if (!jobTable) {
            console.warn(
                "⚠️ Job table not found. Cannot append drilling deep info."
            );
            return;
        }

        const valueA = row["上端深度"] || "";
        const valueB = row["下端深度"] || "";
        const title = row["地質"] || "";

        // ✅ Tạo từng dòng table (label trái - value phải)
        const rows = [
            { label: "上端深度", value: valueA },
            { label: "下端深度", value: valueB },
            { label: "地質", value: title },
        ];

        rows.forEach(({ label, value }) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td style="border: 1px solid #ccc; padding: 6px; width: 25%; background: #f9f9f9;">
          <strong>${label}</strong>
        </td>
        <td style="border: 1px solid #ccc; padding: 6px; width: 75%;">
          ${value || ""}
        </td>
      `;
            jobTable.appendChild(tr);
        });

        console.log("✅ Drilling Deep info appended to Job table.");
    } catch (error) {
        console.error("❌ Failed to load drilling deep site info:", error);
    }
}
