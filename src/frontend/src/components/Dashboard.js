import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import { policyStatusLabel, claimStatusLabel } from '../i18n/labels';

function Dashboard({ policies, claims, onRefresh, apiBase }) {
  const [selectedPolicyId, setSelectedPolicyId] = useState(policies[0]?.id || null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({
    holderName: '',
    planName: '',
    coverageAmount: '',
    status: 'active',
    startDate: '',
    endDate: '',
  });
  const [error, setError] = useState('');

  const selectedPolicy = policies.find(p => p.id === selectedPolicyId);
  const policyClaims = claims.filter(c => c.policyId === selectedPolicyId);
  const pendingCount = policyClaims.filter(c => c.status === 'Pending').length;
  const approvedCount = policyClaims.filter(c => c.status === 'Approved').length;
  const totalClaimed = policyClaims.reduce((sum, c) => sum + c.amount, 0);

  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      holderName: '',
      planName: '',
      coverageAmount: '',
      status: 'active',
      startDate: '',
      endDate: '',
    });
    setError('');
    setShowPolicyModal(true);
  };

  const openEditModal = (policy) => {
    setModalMode('edit');
    setFormData({
      holderName: policy.holderName,
      planName: policy.planName,
      coverageAmount: policy.coverageAmount,
      status: policy.status,
      startDate: policy.startDate,
      endDate: policy.endDate,
    });
    setError('');
    setShowPolicyModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSavePolicy = async (e) => {
    e.preventDefault();

    if (!formData.holderName || !formData.planName || !formData.coverageAmount) {
      setError('すべての項目が必須です');
      return;
    }

    try {
      if (modalMode === 'add') {
        await axios.post(`${apiBase}/policies`, formData);
      } else {
        await axios.patch(`${apiBase}/policies/${selectedPolicyId}`, formData);
      }
      setShowPolicyModal(false);
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.error || 'ポリシーの保存に失敗しました');
    }
  };

  const handleDeletePolicy = async (id, name) => {
    if (window.confirm(`「${name}」のポリシーを削除しますか？関連する請求もすべて削除されます。`)) {
      try {
        await axios.delete(`${apiBase}/policies/${id}`);
        onRefresh();
      } catch (err) {
        alert('ポリシーの削除に失敗しました');
      }
    }
  };

  return (
    <div className="dashboard-container" data-testid="dashboard">
      <div className="page-header">
        <div>
          <h1>ポリシー ダッシュボード</h1>
          <p data-testid="policy-count">アカウントのポリシー: {policies.length} 件</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal} data-testid="add-policy-btn">
          ＋ ポリシー追加
        </button>
      </div>

      {selectedPolicy && (
        <>
          <div className="policy-tabs" data-testid="policy-tabs">
            {policies.map(policy => (
              <div
                key={policy.id}
                className={`policy-tab ${selectedPolicyId === policy.id ? 'active' : ''}`}
                onClick={() => setSelectedPolicyId(policy.id)}
                data-testid={`policy-tab-${policy.id}`}
              >
                <span>{policy.holderName}</span>
                <span className="policy-id">{policy.id}</span>
                <div className="tab-actions">
                  <button
                    className="edit-btn"
                    onClick={(e) => { e.stopPropagation(); openEditModal(policy); }}
                    data-testid={`edit-policy-btn-${policy.id}`}
                  >
                    ✏️
                  </button>
                  <button
                    className="delete-btn"
                    onClick={(e) => { e.stopPropagation(); handleDeletePolicy(policy.id, policy.holderName); }}
                    data-testid={`delete-policy-btn-${policy.id}`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="policy-card" data-testid="policy-card">
            <div className="policy-header">
              <div>
                <p className="policy-plan">{selectedPolicy.planName}</p>
                <p className="policy-id">ポリシーID: {selectedPolicy.id}</p>
              </div>
              <span className={`badge ${selectedPolicy.status === 'active' ? 'success' : 'neutral'}`}>
                {policyStatusLabel(selectedPolicy.status)}
              </span>
            </div>
            <div className="policy-details">
              <div className="detail">
                <span className="label">補償金額</span>
                <span className="value">${selectedPolicy.coverageAmount.toLocaleString()}</span>
              </div>
              <div className="detail">
                <span className="label">契約者</span>
                <span className="value">{selectedPolicy.holderName}</span>
              </div>
              <div className="detail">
                <span className="label">開始日</span>
                <span className="value">{selectedPolicy.startDate}</span>
              </div>
              <div className="detail">
                <span className="label">終了日</span>
                <span className="value">{selectedPolicy.endDate}</span>
              </div>
            </div>
          </div>

          <div className="stats-row" data-testid="stats-row">
            <div className="stat-card" data-testid="stat-total-claims">
              <span className="stat-value">{policyClaims.length}</span>
              <span className="stat-label">請求件数</span>
            </div>
            <div className="stat-card" data-testid="stat-pending">
              <span className="stat-value warning">{pendingCount}</span>
              <span className="stat-label">審査中</span>
            </div>
            <div className="stat-card" data-testid="stat-approved">
              <span className="stat-value success">{approvedCount}</span>
              <span className="stat-label">承認済み</span>
            </div>
            <div className="stat-card" data-testid="stat-total-amount">
              <span className="stat-value">${totalClaimed.toLocaleString()}</span>
              <span className="stat-label">請求総額</span>
            </div>
          </div>

          <div className="section">
            <h2>最近の請求</h2>
            {policyClaims.length === 0 ? (
              <p className="empty">請求はまだありません</p>
            ) : (
              <table className="claims-table" data-testid="recent-claims-table">
                <thead>
                  <tr>
                    <th>請求ID</th>
                    <th>内容</th>
                    <th>金額</th>
                    <th>ステータス</th>
                    <th>申請日</th>
                  </tr>
                </thead>
                <tbody>
                  {policyClaims.slice(0, 5).map(claim => (
                    <tr key={claim.id}>
                      <td className="mono">{claim.id}</td>
                      <td>{claim.description}</td>
                      <td>${claim.amount.toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${claim.status.toLowerCase()}`}>
                          {claimStatusLabel(claim.status)}
                        </span>
                      </td>
                      <td>{new Date(claim.submittedAt).toLocaleDateString('ja-JP')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {showPolicyModal && (
        <div className="modal-overlay" onClick={() => setShowPolicyModal(false)} data-testid="modal-overlay">
          <div className="modal-content" onClick={e => e.stopPropagation()} data-testid="policy-modal">
            <h2>{modalMode === 'add' ? 'ポリシー追加' : 'ポリシー編集'}</h2>
            {error && <div className="alert alert-error" data-testid="policy-form-error">{error}</div>}
            <form onSubmit={handleSavePolicy} noValidate data-testid="policy-form">
              <div className="form-group">
                <label>契約者名</label>
                <input
                  type="text"
                  name="holderName"
                  value={formData.holderName}
                  onChange={handleInputChange}
                  required
                  data-testid="input-holder-name"
                />
              </div>
              <div className="form-group">
                <label>プラン名</label>
                <input
                  type="text"
                  name="planName"
                  value={formData.planName}
                  onChange={handleInputChange}
                  required
                  data-testid="input-plan-name"
                />
              </div>
              <div className="form-group">
                <label>補償金額</label>
                <input
                  type="number"
                  name="coverageAmount"
                  value={formData.coverageAmount}
                  onChange={handleInputChange}
                  required
                  data-testid="input-coverage-amount"
                />
              </div>
              <div className="form-group">
                <label>ステータス</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  data-testid="select-policy-status"
                >
                  <option value="active">有効</option>
                  <option value="inactive">無効</option>
                </select>
              </div>
              <div className="form-group">
                <label>開始日</label>
                <input
                  type="text"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  placeholder="YYYY-MM-DD"
                  required
                  data-testid="input-start-date"
                />
              </div>
              <div className="form-group">
                <label>終了日</label>
                <input
                  type="text"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  placeholder="YYYY-MM-DD"
                  required
                  data-testid="input-end-date"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPolicyModal(false)} data-testid="cancel-policy-btn">
                  キャンセル
                </button>
                <button type="submit" className="btn btn-primary" data-testid="save-policy-btn">
                  {modalMode === 'add' ? 'ポリシー追加' : '変更を保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
