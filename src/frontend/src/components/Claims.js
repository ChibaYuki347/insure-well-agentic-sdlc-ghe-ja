import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Claims.css';
import { claimStatusLabel } from '../i18n/labels';

function Claims({ policies, claims, onRefresh, apiBase, isAdmin }) {
  const [filterPolicyId, setFilterPolicyId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    policy_id: policies[0]?.id || '',
    amount: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filteredClaims = filterPolicyId
    ? claims.filter(c => c.policyId === filterPolicyId)
    : claims;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.policy_id || !formData.amount || !formData.description) {
      setError('すべての項目が必須です');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('金額は 0 より大きい値を入力してください');
      return;
    }

    try {
      setSubmitting(true);
      const payload = new FormData();
      payload.append('policy_id', formData.policy_id);
      payload.append('amount', String(parseFloat(formData.amount)));
      payload.append('description', formData.description);

      await axios.post(`${apiBase}/claims`, payload);
      setShowForm(false);
      setFormData({
        policy_id: policies[0]?.id || '',
        amount: '',
        description: '',
      });
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.error || '請求の申請に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (claimId, newStatus) => {
    try {
      await axios.patch(`${apiBase}/claims/${claimId}/status`, { status: newStatus });
      onRefresh();
    } catch (err) {
      alert('請求ステータスの更新に失敗しました');
    }
  };

  const handleDeleteClaim = async (claimId) => {
    if (window.confirm('この請求を削除しますか？')) {
      try {
        await axios.delete(`${apiBase}/claims/${claimId}`);
        onRefresh();
      } catch (err) {
        alert('請求の削除に失敗しました');
      }
    }
  };

  return (
    <div className="claims-container" data-testid="claims">
      <div className="page-header">
        <div>
          <h1>請求</h1>
          <p>保険金請求の申請と管理</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
          data-testid="new-claim-btn"
        >
          {showForm ? '✕ キャンセル' : '＋ 新規請求'}
        </button>
      </div>

      {showForm && (
        <div className="claim-form-card">
          <h2>新規請求の申請</h2>
          {error && <div className="alert alert-error" data-testid="claim-form-error">{error}</div>}
          <form onSubmit={handleSubmitClaim} data-testid="claim-form">
            <div className="form-row">
              <div className="form-group">
                <label>ポリシー</label>
                <select
                  name="policy_id"
                  value={formData.policy_id}
                  onChange={handleInputChange}
                  required
                  data-testid="select-claim-policy"
                >
                  {policies.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.id} — {p.holderName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>請求金額（USD）</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="例: 1500.00"
                  min="0.01"
                  step="0.01"
                  required
                  data-testid="input-claim-amount"
                />
              </div>
            </div>
            <div className="form-group">
              <label>内容</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="医療サービスや費用の内容を入力してください…"
                rows="3"
                required
                data-testid="input-claim-description"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting} data-testid="submit-claim-btn">
                {submitting ? '申請中…' : '請求を申請'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="section">
        <div className="section-header">
          <h2>申請済みの請求</h2>
          <div className="filter-wrap">
            <label>ポリシーで絞り込み:</label>
            <select value={filterPolicyId} onChange={e => setFilterPolicyId(e.target.value)} data-testid="filter-policy">
              <option value="">すべてのポリシー</option>
              {policies.map(p => (
                <option key={p.id} value={p.id}>
                  {p.id} — {p.holderName}
                </option>
              ))}
            </select>
          </div>
          <span className="claims-count" data-testid="claims-count">{filteredClaims.length} 件</span>
        </div>

        {filteredClaims.length === 0 ? (
          <p className="empty">請求はありません</p>
        ) : (
          <table className="claims-table" data-testid="claims-table">
            <thead>
              <tr>
                <th>請求ID</th>
                <th>ポリシー</th>
                <th>内容</th>
                <th>金額</th>
                <th>ステータス</th>
                <th>申請日</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.map(claim => (
                <tr key={claim.id} data-testid={`claim-row-${claim.id}`}>
                  <td className="mono">{claim.id}</td>
                  <td className="mono">{claim.policyId}</td>
                  <td>{claim.description}</td>
                  <td>${claim.amount.toLocaleString()}</td>
                  <td>
                    {isAdmin ? (
                      <select
                        value={claim.status}
                        onChange={e => handleStatusChange(claim.id, e.target.value)}
                        className={`status-select status-${claim.status.toLowerCase()}`}
                        data-testid={`claim-status-${claim.id}`}
                      >
                        <option value="Pending">{claimStatusLabel('Pending')}</option>
                        <option value="Approved">{claimStatusLabel('Approved')}</option>
                        <option value="Rejected">{claimStatusLabel('Rejected')}</option>
                      </select>
                    ) : (
                      <span className={`status-badge ${claim.status.toLowerCase()}`} data-testid={`claim-status-readonly-${claim.id}`}>
                        {claimStatusLabel(claim.status)}
                      </span>
                    )}
                  </td>
                  <td>{new Date(claim.submittedAt).toLocaleDateString('ja-JP')}</td>
                  <td>
                    {isAdmin ? (
                      <button
                        className="delete-btn-small"
                        onClick={() => handleDeleteClaim(claim.id)}
                        data-testid={`delete-claim-${claim.id}`}
                      >
                        🗑️
                      </button>
                    ) : (
                      <span className="mono">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Claims;
