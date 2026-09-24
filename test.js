(function(){
  const $ = (id) => document.getElementById(id);
  const fmt = (n) => 'Rs ' + Math.round(n).toLocaleString('en-PK');

  const feeEl = $('fee'), semEl = $('semesters'), yrsEl = $('years'),
        infEl = $('inflation'), retEl = $('return'), initEl = $('initial'),
        oneTimeEl = $('onetime');

  function calculate(){
    const F0 = parseFloat(feeEl.value) || 0;
    const S = Math.max(1, parseInt(semEl.value) || 1);
    const n = Math.max(0, parseInt(yrsEl.value) || 0);
    const g = (parseFloat(infEl.value) || 0) / 100;
    const r = (parseFloat(retEl.value) || 0) / 100;
    const I0 = parseFloat(initEl.value) || 0;
    const O0 = parseFloat(oneTimeEl.value) || 0;

    const semesters = [];
    let corpusN = 0;
    for (let i = 0; i < S; i++){
      const t_i = n + i * 0.5;
      const fee_i = F0 * Math.pow(1 + g, t_i);
      const pv = fee_i / Math.pow(1 + r, i * 0.5);
      corpusN += pv;
      semesters.push({ i: i+1, t_i, fee_i, pv });
    }

    const oneTimeAtN = O0 * Math.pow(1 + g, n);
    corpusN += oneTimeAtN;

    const fvI0 = I0 * Math.pow(1 + r, n);
    const corpusFromSip = Math.max(0, corpusN - fvI0);
    const rMonthly = Math.pow(1 + r, 1/12) - 1;
    const nMonths = n * 12;

    let sip = 0;
    if (nMonths > 0 && rMonthly > 0){
      const annuityFactor = (Math.pow(1 + rMonthly, nMonths) - 1) / rMonthly;
      sip = corpusFromSip / annuityFactor;
    } else if (nMonths > 0) {
      sip = corpusFromSip / nMonths;
    }

    const lumpSumToday = corpusN / Math.pow(1 + r, n);
    const totalNominalFees = semesters.reduce((a,b) => a + b.fee_i, 0) + oneTimeAtN;
    const totalInvested = sip * nMonths;

    return { F0, S, n, g, r, I0, O0, oneTimeAtN, semesters, corpusN, fvI0, corpusFromSip, sip, nMonths, rMonthly, lumpSumToday, totalNominalFees, totalInvested };
  }

  function simulateMonths(res){
    let balance = res.I0;
    const totalMonths = res.nMonths + res.S * 6;
    const semesterMonths = res.semesters.map(s => Math.round(s.t_i * 12));

    if (res.nMonths === 0) balance -= res.oneTimeAtN;
    const balancePoints = [Math.max(balance, 0)];

    for (let m = 1; m <= totalMonths; m++){
      balance = balance * (1 + res.rMonthly);
      if (m <= res.nMonths){
        balance += res.sip;
      }
      if (m === res.nMonths && res.nMonths > 0){
        balance -= res.oneTimeAtN;
      }
      const dueIdx = semesterMonths.indexOf(m);
      if (dueIdx !== -1){
        balance -= res.semesters[dueIdx].fee_i;
      }
      balancePoints.push(Math.max(balance, 0));
    }
    return { balancePoints, totalMonths, semesterMonths };
  }

  function buildYearlyRows(res, sim){
    const rows = [];
    const totalYears = Math.ceil(sim.totalMonths / 12) || 0;
    for (let y = 1; y <= totalYears; y++){
      const startMonth = (y - 1) * 12 + 1;
      const endMonth = Math.min(y * 12, sim.totalMonths);
      let invested = 0, feesPaid = 0;
      for (let m = startMonth; m <= endMonth; m++){
        if (m <= res.nMonths) invested += res.sip;
        if (m === res.nMonths && res.nMonths > 0) feesPaid += res.oneTimeAtN;
        const idx = sim.semesterMonths.indexOf(m);
        if (idx !== -1) feesPaid += res.semesters[idx].fee_i;
      }
      if (y === 1 && res.nMonths === 0) feesPaid += res.oneTimeAtN;
      const endBalance = sim.balancePoints[endMonth];
      const phase = feesPaid > 0
        ? (invested > 0 ? 'Saving + paying' : 'Paying fees')
        : (invested > 0 ? 'Saving' : '—');
      rows.push({ year: y, phase, invested, feesPaid, endBalance });
    }
    return rows;
  }

  function render(){
    const res = calculate();

    const isLumpsumOnly = res.n === 0;
    $('warn').style.display = isLumpsumOnly ? 'block' : 'none';
    $('sip-out').innerHTML = (isLumpsumOnly ? 'Rs 0' : fmt(res.sip)) + ' <span style="font-size: 20px; font-weight: 500; opacity: 0.8;">/month</span>';
    $('sip-sub').textContent = isLumpsumOnly
      ? 'With university starting now, a monthly plan can\'t build up in time — see the lump sum figure instead.'
      : 'This grows at your chosen return until the first semester is due, then keeps working while you draw it down.';
    $('stat-invested').textContent = fmt(res.totalInvested);
    $('stat-fees').textContent = fmt(res.totalNominalFees);
    $('lumpsum-out').textContent = fmt(res.lumpSumToday);

    const oneTimeRow = res.oneTimeAtN > 0
      ? `<tr><td>One-time</td><td>Year ${res.n}, start</td><td style="text-align:right;">${fmt(res.oneTimeAtN)}</td></tr>`
      : '';
    const rows = oneTimeRow + res.semesters.map(s => {
      const yr = Math.floor(s.t_i);
      const half = (s.t_i % 1 === 0) ? 'H1' : 'H2';
      return `<tr><td>Semester ${s.i}</td><td>Year ${yr}, ${half}</td><td style="text-align:right;">${fmt(s.fee_i)}</td></tr>`;
    }).join('');
    $('table-body').innerHTML = rows;

    const sim = simulateMonths(res);
    const yearlyRows = buildYearlyRows(res, sim);
    $('yearly-table-body').innerHTML = yearlyRows.map(r => `
      <tr>
        <td>Year ${r.year}</td>
        <td>${r.phase}</td>
        <td style="text-align:right;">${r.invested > 0 ? fmt(r.invested) : '—'}</td>
        <td style="text-align:right; color: var(--accent-red);">${r.feesPaid > 0 ? '-' + fmt(r.feesPaid) : '—'}</td>
        <td style="text-align:right; font-weight: 600;">${fmt(r.endBalance)}</td>
      </tr>
    `).join('');
  }

  document.getElementById('invest-toggle').addEventListener('click', (e) => {
    const t = e.target.closest('.toggle-btn');
    if (!t) return;
    document.querySelectorAll('#invest-toggle .toggle-btn').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    retEl.value = t.dataset.return;
    render();
  });

  [feeEl, semEl, yrsEl, infEl, retEl, initEl, oneTimeEl].forEach(el => {
    el.addEventListener('input', () => {
      document.querySelectorAll('#invest-toggle .toggle-btn').forEach(x => x.classList.remove('active'));
      const match = document.querySelector(`#invest-toggle .toggle-btn[data-return="${retEl.value}"]`);
      if (match) match.classList.add('active');
      render();
    });
  });

  render();
})();
