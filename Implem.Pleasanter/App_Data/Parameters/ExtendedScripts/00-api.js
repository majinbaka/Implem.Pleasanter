function callApiGetJob(siteId) {
  return new Promise((resolve, reject) => {
    $p.apiGet({
      id: siteId,
      data: {
        View: {
          ApiDataType: 'KeyValues',
          GridColumns: ['Title', 'ClassA', 'ClassB', 'DescriptionA'],
        },
      },
      done: data => {
        const row = data?.Response?.Data?.[0];
        if (!row) {
          reject('No job data found');
          return;
        }
        resolve(row);
      },
      fail: err => reject(err),
    });
  });
}

function callApiGetDrillHole(siteId) {
  return new Promise((resolve, reject) => {
    $p.apiGet({
      id: siteId,
      data: {
        View: {
          ApiDataType: 'KeyValues',
          GridColumns: ['Ver', 'ボーリング連番'], // lấy cả 2 cột nếu cần
        },
      },
      done: data => {
        const row = data?.Response?.Data?.[0];
        if (!row) {
          reject('No drilling hole data found');
          return;
        }
        resolve(row);
      },
      fail: err => reject(err),
    });
  });
}

function callApiGetDrillingDeep(siteId) {
  return new Promise((resolve, reject) => {
    $p.apiGet({
      id: siteId,
      data: {
        View: {
          ApiDataType: 'KeyValues',
          GridColumns: ['NumA', 'NumB', 'Title', 'Body'],
        },
      },
      done: data => {
        const row = data?.Response?.Data?.[0];
        if (!row) {
          reject('No drilling deep data found');
          return;
        }
        resolve(row);
      },
      fail: err => reject(err),
    });
  });
}
