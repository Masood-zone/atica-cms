import { format } from "date-fns";
import type {
  ClassPaidReport,
  ClassUnpaidReport,
} from "@/services/api/reports/reports.api";

type MinimalClass = { id: number; name: string };

export function printReport(opts: {
  type: "paid" | "unpaid";
  logoSrc: string;
  classId: number;
  classes?: MinimalClass[];
  paid?: ClassPaidReport;
  unpaid?: ClassUnpaidReport;
  from?: Date;
  to?: Date;
}) {
  const { type, logoSrc, classId, classes, paid, unpaid, from, to } = opts;

  const selectedClass = classes?.find((c) => c.id === classId);
  const className = selectedClass?.name ?? `Class #${classId || "-"}`;
  const dateRange = `${from ? format(from, "PPP") : "-"} — ${
    to ? format(to, "PPP") : "-"
  }`;
  const generatedOn = format(new Date(), "PPpp");

  let rowsHtml = "";
  let totalAmount = 0;
  let totalCount = 0;
  if (type === "paid" && paid?.students) {
    paid.students.forEach((s) => {
      s.records.forEach((r) => {
        const amt = Number(r.settingsAmount ?? 0);
        totalAmount += amt;
        totalCount += 1;
        rowsHtml += `<tr>
          <td>${format(new Date(r.submitedAt), "PP p")}</td>
          <td>${s.studentName}</td>
          <td class="text-right">₵ ${amt.toFixed(2)}</td>
          <td>${r.isPrepaid ? "Prepaid" : r.hasPaid ? "Paid" : ""}</td>
        </tr>`;
      });
    });
  } else if (type === "unpaid" && unpaid?.students) {
    unpaid.students.forEach((s) => {
      s.records.forEach((r) => {
        totalCount += 1;
        rowsHtml += `<tr>
          <td>${format(new Date(r.submitedAt), "PP p")}</td>
          <td>${s.studentName}</td>
          <td class="text-right">—</td>
          <td>Unpaid</td>
        </tr>`;
      });
    });
  }

  const summaryHtml =
    type === "paid"
      ? `<div class="summary"><div>Total Records: <b>${totalCount}</b></div><div>Total Amount: <b>₵ ${totalAmount.toFixed(
          2
        )}</b></div></div>`
      : `<div class="summary"><div>Total Unpaid Records: <b>${totalCount}</b></div></div>`;

  // Create a hidden iframe and clone styles so Tailwind/shadcn variables apply
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write("<!doctype html><html><head><title>Report</title>");
  // Copy over stylesheet links and inline styles from current document
  const head = document.head.cloneNode(true) as HTMLElement;
  // Remove any script tags for safety
  head.querySelectorAll("script").forEach((s) => s.remove());
  doc.write(head.innerHTML);
  // Add themed invoice-like styles with primary background header
  doc.write(`
    <style>
      @media print { @page { margin: 10mm; } }
      :root { --muted: #6b7280; }
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; padding: 0; color: #0f172a; }
      .header { background: hsl(var(--primary)); color: white; padding: 24px 28px; }
      .header-top { display:flex; align-items:center; justify-content: space-between; }
      .brand { display:flex; align-items:center; gap:12px; font-weight: 700; letter-spacing: .3px; }
      .brand img { width: 36px; height:36px; object-fit: contain; filter: drop-shadow(0 1px 2px rgba(0,0,0,.25)); }
      .title { font-size: 14px; opacity:.95; }
      .badge { font-weight:700; font-size: 24px; text-transform: uppercase; letter-spacing: 1px; }
      .meta { display:flex; gap:28px; flex-wrap:wrap; margin-top: 12px; font-size: 12px; opacity:.95; }
      .meta div { display:flex; gap:6px; }
      .container { padding: 24px 28px; }
      .section-title { font-weight:600; margin: 8px 0 12px; color: #0f172a; }
      table { width:100%; border-collapse: collapse; }
      thead th { background: hsl(var(--primary)); color:white; text-align: left; font-weight:600; padding: 10px 12px; font-size: 12px; }
      tbody td { border-bottom: 1px solid #e5e7eb; padding: 10px 12px; font-size: 12px; color:#111827; }
      .text-right { text-align:right; }
      .summary { display:flex; justify-content:flex-end; gap:24px; margin-top: 12px; font-size: 13px; }
      .footer { color: var(--muted); font-size: 11px; margin-top: 16px; text-align:center; }
    </style>
  `);
  doc.write("</head><body>");
  // Header
  doc.write(`
    <div class="header">
      <div class="header-top">
        <div class="brand">
          <img src="${logoSrc}" alt="Logo" />
          <div>
            <div class="title">Canteen Management System</div>
            <div style="font-size:11px; opacity:.9;">${
              type === "paid" ? "Paid Report" : "Unpaid Report"
            }</div>
          </div>
        </div>
        <div class="badge">${type.toUpperCase()}</div>
      </div>
      <div class="meta">
        <div><strong>Class:</strong> <span>${className}</span></div>
        <div><strong>Date range:</strong> <span>${dateRange}</span></div>
        <div><strong>Generated:</strong> <span>${generatedOn}</span></div>
      </div>
    </div>
  `);
  // Body
  doc.write(`
    <div class="container">
      <div class="section-title">Details</div>
      <table>
        <thead>
          <tr><th>Date</th><th>Student</th><th class="text-right">Amount</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${
            rowsHtml ||
            `<tr><td colspan="4" style="text-align:center; color:#6b7280; padding:16px;">No data available for the selected filters.</td></tr>`
          }
        </tbody>
      </table>
      ${summaryHtml}
      <div class="footer">Thank you.</div>
    </div>
  `);
  doc.write("</body></html>");
  doc.close();

  const print = () => {
    const win = iframe.contentWindow;
    if (!win) return;
    win.focus();
    win.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };
  setTimeout(print, 400);
}
