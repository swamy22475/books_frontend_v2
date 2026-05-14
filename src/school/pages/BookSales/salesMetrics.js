export const toNumber = (value) => Number(value || 0);

const saleId = (sale) => sale?.id;
const saleQty = (sale) => toNumber(sale?.qty);
const saleUnitPrice = (sale) => toNumber(sale?.unit_price ?? sale?.price);
const saleAmount = (sale) => toNumber(sale?.total_amount ?? sale?.total ?? (saleUnitPrice(sale) * saleQty(sale)));
const saleStudent = (sale) => String(sale?.student_name ?? sale?.student ?? '').trim().toLowerCase();
const saleBook = (sale) => String(sale?.book_name ?? sale?.book ?? '').trim().toLowerCase();
const saleClass = (sale) => String(sale?.student_class ?? sale?.class ?? '').trim().toLowerCase();

export const lineAmount = (line) => toNumber(line?.total_amount ?? (toNumber(line?.unit_price) * toNumber(line?.qty)));

const isApprovedReturn = (entry) => String(entry?.status || '').toLowerCase() === 'approved';

const sameReturnTarget = (sale, entry) => {
    const student = String(entry?.student_name ?? entry?.student ?? '').trim().toLowerCase();
    const book = String(entry?.book_name ?? entry?.book ?? '').trim().toLowerCase();
    const klass = String(entry?.student_class ?? entry?.class ?? '').trim().toLowerCase();

    if (student && saleStudent(sale) !== student) return false;
    if (book && saleBook(sale) !== book) return false;
    if (klass && saleClass(sale) && saleClass(sale) !== klass) return false;
    return Boolean(student || book);
};

const applyReturnToSale = (adjustments, sale, qty, amount) => {
    const id = saleId(sale);
    if (!id || qty <= 0) return;
    if (!adjustments[id]) adjustments[id] = { qty: 0, amount: 0 };
    adjustments[id].qty += qty;
    adjustments[id].amount += amount;
};

export const allocateReturnAdjustments = (sales = [], returns = []) => {
    const salesById = new Map(sales.map(sale => [Number(saleId(sale)), sale]));
    const adjustments = {};

    returns.filter(isApprovedReturn).forEach(entry => {
        const directSale = entry.sale_id ? salesById.get(Number(entry.sale_id)) : null;
        if (directSale) {
            applyReturnToSale(adjustments, directSale, toNumber(entry.qty), lineAmount(entry));
            return;
        }

        let remainingQty = toNumber(entry.qty);
        const returnUnitPrice = toNumber(entry.unit_price);
        const candidates = sales
            .filter(sale => sameReturnTarget(sale, entry))
            .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

        candidates.forEach(sale => {
            if (remainingQty <= 0) return;
            const alreadyReturned = toNumber(adjustments[saleId(sale)]?.qty);
            const availableQty = Math.max(saleQty(sale) - alreadyReturned, 0);
            const qty = Math.min(availableQty, remainingQty);
            const unitPrice = returnUnitPrice || saleUnitPrice(sale);
            applyReturnToSale(adjustments, sale, qty, unitPrice * qty);
            remainingQty -= qty;
        });
    });

    return adjustments;
};

export const getNetSaleQty = (sale, adjustments = {}) => (
    Math.max(saleQty(sale) - toNumber(adjustments[saleId(sale)]?.qty), 0)
);

export const getNetSaleAmount = (sale, adjustments = {}) => (
    Math.max(saleAmount(sale) - toNumber(adjustments[saleId(sale)]?.amount), 0)
);
