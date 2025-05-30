import React, { useState } from 'react';

const MedicalSplitCalculator = () => {
    const [totals, setTotals] = useState({
        billed: '',
        allowed: '',
        paid: '',
        patientResp: '',
    });
    const [splits, setSplits] = useState([{ amount: '' }, { amount: '' }]);

    const handleTotalsChange = (field, value) => {
        setTotals(prev => {
            const updated = { ...prev, [field]: value };
            updated.patientResp = updated.allowed - updated.paid;
            return updated;
        });
    };

    const handleSplitChange = (index, value) => {
        const updated = [...splits];
        updated[index].amount = value;
        setSplits(updated);
    };

    const addSplit = () => {
        setSplits([...splits, { amount: '' }]);
    };

    const calculateSplitDetails = (amount) => {
        const total = splits.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
        if (!total || !amount) return { allowed: 0, paid: 0, patientResp: 0 };
        const ratio = Number(amount) / total;
        const allowed = (totals.allowed || 0) * ratio;
        const paid = (totals.paid || 0) * ratio;
        const patientResp = allowed - paid;
        return {
            allowed: allowed,
            paid: paid.toFixed(2),
            patientResp: patientResp.toFixed(2),
        };
    };

    return (
        <div className="p-4 max-w-xl mx-auto space-y-6">
            <h2 className="text-xl font-semibold">Medical Billing Split-Up</h2>

            <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Total Billed" className="p-2 border rounded" value={totals.billed} onChange={e => handleTotalsChange('billed', +e.target.value)} />
                <input type="number" placeholder="Allowed" className="p-2 border rounded" value={totals.allowed} onChange={e => handleTotalsChange('allowed', +e.target.value)} />
                <input type="number" placeholder="Paid" className="p-2 border rounded" value={totals.paid} onChange={e => handleTotalsChange('paid', +e.target.value)} />
                <input type="number" placeholder="Patient Responsibility" className="p-2 border rounded" value={totals.patientResp} readOnly />
            </div>

            <div className="space-y-4">
                <h3 className="font-medium">Split Billed Amounts</h3>
                {splits.map((split, index) => {
                    const details = calculateSplitDetails(split.amount);
                    return (
                        <div key={index} className="grid grid-cols-4 gap-2 items-center">
                            <input
                                type="number"
                                placeholder="Billed"
                                value={split.amount}
                                onChange={(e) => handleSplitChange(index, e.target.value)}
                                className="p-2 border rounded"
                            />
                            <input type="number" readOnly value={details.allowed} className="p-2 border rounded bg-gray-100" />
                            <input type="number" readOnly value={details.paid} className="p-2 border rounded bg-gray-100" />
                            <input type="number" readOnly value={details.patientResp} className="p-2 border rounded bg-gray-100" />
                        </div>
                    );
                })}
                <button onClick={addSplit} className="px-4 py-2 bg-blue-500 text-white rounded">+ Add</button>
            </div>
        </div>
    );
};

export default MedicalSplitCalculator;
