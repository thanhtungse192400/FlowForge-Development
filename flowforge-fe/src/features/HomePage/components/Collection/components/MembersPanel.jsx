import React, { useState } from "react";
import { useProjectMembers } from "../../../../Project/hooks/useProjectMembers";
import { useUserSearch } from "../../../../User/hooks/useUsers";

export default function MembersPanel({ projectId }) {
  const { members, addMember, removeMember, updateRole, isAdding, isRemoving, isUpdatingRole } = useProjectMembers(projectId);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const { data: searchResults = [] } = useUserSearch(searchQuery);

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleAddMember = async (userId) => {
    try {
      await addMember({ userId, role: "MEMBER" });
      setSearchQuery("");
      setShowResults(false);
    } catch (e) {
      alert("Failed to add member: " + (e.message || e));
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm("Are you sure you want to remove this member from the project?")) return;
    try {
      await removeMember(userId);
    } catch (e) {
      alert("Failed to remove member: " + (e.message || e));
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateRole({ userId, role: newRole });
    } catch (e) {
      alert("Failed to update role: " + (e.message || e));
    }
  };

  return (
    <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em", color: "#111" }}>
          Project Members ({members.length})
        </span>
      </div>

      {/* Invite Member Search Input */}
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Invite member by name/email..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          style={{ width: "100%", padding: "8px 12px", background: "#f6f5f1", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "6px", fontSize: "12px", boxSizing: "border-box" }}
        />
        
        {showResults && searchQuery.trim().length > 0 && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, maxHeight: "150px", overflowY: "auto", marginTop: "4px" }}>
            {searchResults.length === 0 ? (
              <div style={{ padding: "8px 12px", fontSize: "11px", color: "#999", fontStyle: "italic" }}>No users found</div>
            ) : (
              searchResults.map((user) => (
                <div key={user.id} onClick={() => handleAddMember(user.id)} style={{ padding: "8px 12px", cursor: "pointer", fontSize: "12px", borderBottom: "1px solid rgba(0,0,0,0.04)" }} onMouseEnter={(e) => e.target.style.background = "#f6f5f1"} onMouseLeave={(e) => e.target.style.background = "none"}>
                  <div style={{ fontWeight: "600" }}>{user.name}</div>
                  <div style={{ fontSize: "10px", color: "#666" }}>{user.email}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Members List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "180px", overflowY: "auto" }}>
        {members.map((member) => (
          <div key={member.userId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f6f5f1", padding: "8px 10px", borderRadius: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#111", color: "#f6f5f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700" }}>
                {getInitials(member.userName)}
              </div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "600", color: "#111" }}>{member.userName}</div>
                {/* Role Dropdown */}
                <select 
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                  disabled={member.role === "OWNER" || isUpdatingRole}
                  style={{ fontSize: "9px", background: "transparent", border: "none", color: "rgba(0,0,0,0.5)", textTransform: "uppercase", fontWeight: "bold", cursor: "pointer", padding: 0 }}
                >
                  <option value="MEMBER">Member</option>
                  <option value="OWNER">Project Owner</option>
                </select>
              </div>
            </div>

            {/* Remove Action */}
            {member.role !== "OWNER" && (
              <button
                onClick={() => handleRemoveMember(member.userId)}
                disabled={isRemoving}
                style={{ background: "none", border: "none", color: "#d32f2f", cursor: "pointer", fontSize: "11px" }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}