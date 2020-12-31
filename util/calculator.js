const calculator = {
  // getKhoangThoiGianKhoiHanh(timeWindowsHienTai, serviceTimeHienTai) {
  //   return [
  //     timeWindowsHienTai[0] + serviceTimeHienTai,
  //     timeWindowsHienTai[1] + serviceTimeHienTai,
  //   ];
  // },
  getKhoangThoiGianDenGap(
    timeWindowsHienTai,
    serviceTimeHienTai,
    timeTravelDiemTiepTheo
  ) {
    let khoangThoiGianKhoiHanh = this.getKhoangThoiGianKhoiHanh(
      timeWindowsHienTai,
      serviceTimeHienTai
    );
    return [
      khoangThoiGianKhoiHanh[0] + timeTravelDiemTiepTheo,
      khoangThoiGianKhoiHanh[1] + timeTravelDiemTiepTheo,
    ];
  },
  isNgoaiNhau(timeWindowsA, timeWindowsB) {
    if (
      timeWindowsB[1] <= timeWindowsA[0] &&
      timeWindowsB[0] <= timeWindowsB[1]
    )
      return true;
    else if (
      timeWindowsA[1] <= timeWindowsB[0] &&
      timeWindowsA[0] <= timeWindowsA[1]
    )
      return true;
    return false;
  },
  isLongNhau(timeWindowsA, timeWindowsB) {
    if (
      timeWindowsB[0] <= timeWindowsA[0] &&
      timeWindowsB[1] >= timeWindowsA[1]
    )
      return true;
    else if (
      timeWindowsA[0] <= timeWindowsB[0] &&
      timeWindowsA[1] >= timeWindowsB[1]
    )
      return true;
    return false;
  },
  getPhanLongNhau(timeWindowsA, timeWindowsB) {
    if (this.isLongNhau(timeWindowsA, timeWindowsB) == false) return [];
    if (
      timeWindowsB[0] <= timeWindowsA[0] &&
      timeWindowsB[1] >= timeWindowsA[1]
    )
      return timeWindowsA;
    return timeWindowsB;
  },
  isGiaoNhau(timeWindowsA, timeWindowsB) {
    if (this.isNgoaiNhau(timeWindowsA, timeWindowsB) == false) return true;
    return false;
  },
  getPhanGiaoNhau(timeWindowsA, timeWindowsB) {
    if (this.isGiaoNhau(timeWindowsA, timeWindowsB)) {
      if (this.isLongNhau(timeWindowsA, timeWindowsB)) {
        return this.getPhanLongNhau(timeWindowsA, timeWindowsB);
      } else {
        let times = [timeWindowsA, timeWindowsB];
        let timeStarts = times.map((x) => x[0]);
        let timeEnds = times.map((x) => x[1]);
        return [
          Math.max.apply(null, timeStarts),
          Math.min.apply(null, timeEnds),
        ];
      }
    }
    return [];
  },
  getKhoangThoiGianDenGapKhachCuoiCung(timeWindows, serviceTimes, timeTravles) {
    let timeWindow = timeWindows[0];
    for (i = 0; i < timeTravles.length; i++) {
      timeWindow = this.getKhoangThoiGianDenGap(
        timeWindow,
        serviceTimes[i],
        timeTravles[i]
      );
      timeWindow = this.getPhanGiaoNhau(timeWindow, timeWindows[i + 1]);
    }
    return timeWindow;
  },
  getKhoangThoiGianKhoiHanh(timeWindows, serviceTimes, timeTravles) {
    let khoangThoiGianDenGapKhachCuoiCung = this.getKhoangThoiGianDenGapKhachCuoiCung(
      timeWindows,
      serviceTimes,
      timeTravles
    );
    return khoangThoiGianDenGapKhachCuoiCung.map(
      (x) =>
        x -
        serviceTimes.reduce((a, b) => a + b) -
        timeTravles.reduce((a, b) => a + b)
    );
  },
  randomizeThoiDiemTrongKhungGio(timeWindow) {
    let percentage = Math.random();
    return timeWindow[0] + percentage * (timeWindow[1] - timeWindow[0]);
  },
  getThoiDiemDenDiemCuoiCung(timeWindows, serviceTimes, timeTravles) {
    if (
      this.isGiaoNhau(
        this.getKhoangThoiGianDenGapKhachCuoiCung(
          timeWindows,
          serviceTimes,
          timeTravles
        ),
        timeWindows[timeWindows.length - 1]
      )
    )
      return this.randomizeThoiDiemTrongKhungGio(
        this.getPhanGiaoNhau(
          this.getKhoangThoiGianDenGapKhachCuoiCung(
            timeWindows,
            serviceTimes,
            timeTravles
          ),
          timeWindows[timeWindows.length - 1]
        )
      );
    return -1;
  },
  getThoiDiemDiNenBatDau(timeWindows, serviceTimes, timeTravles) {
    if (timeWindows.length == 1)
      return (
        this.randomizeThoiDiemTrongKhungGio(timeWindows[0]) - timeTravles[0]
      );

    let timeTravlesNoDepot = timeTravles.filter(function (x, i) {
      if (i != 0) return true;
      return false;
    });

    let thoiDiemGapKhachCuoi = this.getThoiDiemDenDiemCuoiCung(
      timeWindows,
      serviceTimes,
      timeTravlesNoDepot
    );
    let tongServiceTime = serviceTimes
      .filter(function (x, i) {
        if (i == serviceTimes.length - 1) return false;
        return true;
      })
      .reduce((a, b) => a + b);
    let tongTravelTime = timeTravles.reduce((a, b) => a + b);

    return thoiDiemGapKhachCuoi - tongServiceTime - tongTravelTime;
  },
};

module.exports = { calculator };
