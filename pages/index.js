import { useEffect, useState } from "react";
import { Phone, Users, Calendar, User, CreditCard, Settings, Filter, Shield, Star, Crown, ArrowUpDown, Eye, EyeOff } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CountUp({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1200; 
    const steps = 60;      
    const increment = end / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const next = Math.round(increment * currentStep);

      if (currentStep >= steps) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(next);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return count;
}

export default function Home() {
  const [data, setData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [activePage, setActivePage] = useState("");
  const [ready, setReady] = useState(false);  const [activeCalendar, setActiveCalendar] = useState("Frau Dr. Tilse");
  const [activeSettingsTab, setActiveSettingsTab] = useState("Praxisdaten");  
  const [settings, setSettings] = useState({ startPage: "Anrufe", emailNewCalls: true, dailySummary: false, compactView: false, entriesPerPage: "25", highlightCallbacks: true, showCalendarFirst: false, autoOpenNewCalls: true, practiceNotes: "", practiceName: "Praxis Dr. Tilse", practiceAddress: "Königstraße 12, 23552 Lübeck", practiceEmail: "info@praxis-tilse.de", practiceWebsite: "www.praxis-tilse.de", practicePhone: "0451 / 123456", practiceOpeningHours: { Montag: [["07:00", "12:00"], ["14:00", "16:00"]], Dienstag: [["07:00", "12:00"], ["14:00", "16:00"]], Mittwoch: [["07:00", "12:00"], ["14:00", "16:00"]], Donnerstag: [["07:00", "12:00"], ["14:00", "16:00"]], Freitag: [["07:00", "12:00"], ["Geschlossen", "Geschlossen"]], Samstag: [["Geschlossen", "Geschlossen"], ["Geschlossen", "Geschlossen"]] } });  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("✓ Erfolgreich aktualisiert");
  const [pendingPlan, setPendingPlan] = useState(null);
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Alle");
  const [keepVisibleIds, setKeepVisibleIds] = useState([]);
  const [search, setSearch] = useState("");  
  const [anliegenFilter, setAnliegenFilter] = useState("Alle");
  const [arztFilter, setArztFilter] = useState("Alle");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;  
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [appointmentPatient, setAppointmentPatient] = useState("");
  const [appointmentExisting, setAppointmentExisting] = useState("Ja");
  const [appointmentBirthdate, setAppointmentBirthdate] = useState("");
  const [appointmentExtras, setAppointmentExtras] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentDoctor, setAppointmentDoctor] = useState(activeCalendar);
  const [appointmentNote, setAppointmentNote] = useState("");
  const [contacts, setContacts] = useState([]);
  const [contactSearch, setContactSearch] = useState("");
  const [contactDoctorFilter, setContactDoctorFilter] = useState("Alle");
  const [contactExistingFilter, setContactExistingFilter] = useState("Alle");
  const [showAddContact, setShowAddContact] = useState(false);
  const [contactSort, setContactSort] = useState("nameAZ");
  const [openContactIndex, setOpenContactIndex] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [manualContacts, setManualContacts] = useState([]);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactBirthdate, setNewContactBirthdate] = useState("");
  const [newContactExisting, setNewContactExisting] = useState("Bestandspatient");
  const [newContactDoctor, setNewContactDoctor] = useState("Frau Dr. Tilse");
  const [editingContactIndex, setEditingContactIndex] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [editingUserIndex, setEditingUserIndex] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [confirmDeleteUserIndex, setConfirmDeleteUserIndex] = useState(null);
  const [newEmployeePasswordRepeat, setNewEmployeePasswordRepeat] = useState("");
  const [showEmployeePassword, setShowEmployeePassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [users, setUsers] = useState([
    {
      id: "arzt",
      password: "1234",
      name: "Dr. Tilse",
      role: "Arzt",
      accessLevel: "Admin",
      permissions: ["Kalender verwalten", "Erweiterte Einstellungen", "Praxisdaten ändern", "Mitgliedschaft einsehen", "Mitarbeiter verwalten"]
    },
    {
      id: "mitarbeiterin",
      password: "1234",
      name: "Frau Meier",
      role: "Mitarbeiterin",
      accessLevel: "Eingeschränkt",
      permissions: ["Anrufe bearbeiten", "Kalender ansehen", "Kontakte ansehen"]
    }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("users");
    if (saved) {
      setUsers(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);
    
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeId, setNewEmployeeId] = useState("");
  const [newEmployeePassword, setNewEmployeePassword] = useState("");
  const [newEmployeeRole, setNewEmployeeRole] = useState("Mitarbeiterin");
  const [newEmployeeAccessLevel, setNewEmployeeAccessLevel] = useState("Eingeschränkt");
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [currentUser, setCurrentUser] = useState(users[0]);  
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [loginTime, setLoginTime] = useState(new Date());
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key !== "Escape") return;
  
      setConfirmAction(null);
      setSelectedContact(null);
      setShowAddContact(false);
      setShowAddAppointment(false);
      setShowAddEmployee(false);
      setPendingPlan(null);
    };
  
    window.addEventListener("keydown", handleEsc);
  
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);
  
  const parseGermanDate = (dateString) => { if (!dateString) return null; const [day, month, year] = dateString.split("."); return new Date(Number(year), Number(month) - 1, Number(day)); };
  const setQuickRange = (type) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    const end = new Date(today);
  
    if (type === "Heute") setDateRange([today, today]);
    if (type === "Gestern") { start.setDate(today.getDate() - 1); setDateRange([start, start]); }
    if (type === "Letzte 7 Tage") { start.setDate(today.getDate() - 6); setDateRange([start, end]); }
    if (type === "Letzte 30 Tage") { start.setDate(today.getDate() - 29); setDateRange([start, end]); }
    if (type === "Diese Woche") { start.setDate(today.getDate() - ((today.getDay() + 6) % 7)); setDateRange([start, end]); }
    if (type === "Letzte Woche") { start.setDate(today.getDate() - ((today.getDay() + 6) % 7) - 7); end.setDate(start.getDate() + 6); setDateRange([start, end]); }
    if (type === "Dieser Monat") { start.setDate(1); setDateRange([start, end]); }
    if (type === "Letzter Monat") { start.setMonth(today.getMonth() - 1, 1); end.setMonth(today.getMonth(), 0); setDateRange([start, end]); }
    if (type === "Zurücksetzen") setDateRange([null, null]);
  };

  useEffect(() => {
    fetch("https://opensheet.elk.sh/1AFGmKqR2typaxKARBprS81ArcBUqXg1RX8sXwNyO1oY/Tabellenblatt1")
      .then((res) => res.json())
      .then((sheetData) => {
  
        const savedStatuses = JSON.parse(localStorage.getItem("callStatuses") || "{}");
  
        const calls = [...sheetData].reverse().map((row, index) => {
          const callId = btoa(row.Name + row.Datum + row.Uhrzeit);
  
          return {
            ...row,
            callId,
            status: savedStatuses[callId] || "Neu / Ungelesen"
          };
        });
  
        setData(calls);
      });
  }, []);

  useEffect(() => { const saved = JSON.parse(localStorage.getItem("manualContacts") || "[]"); setManualContacts(saved); }, []);
  
  useEffect(() => {
    if (!data.length) return;
  
    const grouped = {};
  
    data.forEach(call => {
      const phone =
        call.Telefonnummer ||
        call.Rufnummer ||
        call["Telefonnummer "] ||
        call["Rufnummer "] ||
        "Unbekannt";
  
      if (!grouped[phone]) {
        grouped[phone] = {
          name: call.Name,
          phone: phone,
          existing: call.Bestandspatient,
          doctor: call.Arzt,
          birthdate: call.Geburtsdatum,
          calls: []
        };
      }
  
      grouped[phone].calls.push(call);
    });
  
    const contactsArray = Object.values(grouped).map(contact => {
      const sortedCalls = contact.calls.sort((a, b) => {
        const dateA = parseGermanDate(a.Datum);
        const dateB = parseGermanDate(b.Datum);
        return dateB - dateA;
      });
  
      return {
        name: contact.name,
        phone: contact.phone,
        existing: contact.existing,
        doctor: contact.doctor,
        birthdate: contact.birthdate,
        lastContact: sortedCalls[0]?.Datum,
        calls: sortedCalls
      };
    });
  
    // alphabetisch sortieren
    contactsArray.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  
    setContacts(contactsArray);
  }, [data]);

  const updateStatus = (callId, value) => {
    setData(prev => {
      const updated = prev.map(row =>
        row.callId === callId ? { ...row, status: value } : row
      );
  
      const statusMap = {};
      updated.forEach(row => {
        statusMap[row.callId] = row.status;
      });
  
      localStorage.setItem("callStatuses", JSON.stringify(statusMap));
  
      return updated;
    });
  };
  
  const saveSettings = () => {
    localStorage.setItem("dashboardSettings", JSON.stringify(settings));
    setToastMessage("✓ Erfolgreich aktualisiert");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
  };
  
  useEffect(() => {
    const savedSettings = localStorage.getItem("dashboardSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({ ...prev, ...parsed }));
      setActivePage(["Anrufe", "Kalender"].includes(parsed.startPage) ? parsed.startPage : "Anrufe");
    } else {
      setActivePage("Anrufe");
    }
    setReady(true);
  }, []);
  
  useEffect(() => {
    setAppointmentDoctor(activeCalendar);
  }, [activeCalendar]);  
  
  const termine = data.filter(r => (r.Anliegen || "").split(",").map(x => x.trim()).includes("Termin")).length;
  const rezepte = data.filter(r => (r.Anliegen || "").split(",").map(x => x.trim()).includes("Rezept")).length;
  const atteste = data.filter(r => (r.Anliegen || "").split(",").map(x => x.trim()).includes("Attest")).length;

  const filteredData = data.filter((row) => {
    const dateMatch =
      (!startDate && !endDate) ||
      (() => {
        const rowDate = parseGermanDate(row.Datum);
        return (
          rowDate &&
          (!startDate || rowDate >= startDate) &&
          (!endDate || rowDate <= endDate)
        );
      })();
  
    return dateMatch;
  });
  
  const kpiTermine = filteredData.filter(r => (r.Anliegen || "").split(",").map(x => x.trim()).includes("Termin")).length;
  const kpiRezepte = filteredData.filter(r => (r.Anliegen || "").split(",").map(x => x.trim()).includes("Rezept")).length;
  const kpiAtteste = filteredData.filter(r => (r.Anliegen || "").split(",").map(x => x.trim()).includes("Attest")).length;

  const appointmentTimes = [
    "07:00", "07:15", "07:30", "07:45",
    "08:00", "08:15", "08:30", "08:45",
    "09:00", "09:15", "09:30", "09:45",
    "10:00", "10:15", "10:30", "10:45",
    "11:00", "11:15", "11:30", "11:45",
    "14:00", "14:15", "14:30", "14:45",
    "15:00", "15:15", "15:30", "15:45"
  ];

  const timeOptions = ["Geschlossen", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];
  
  const toggleExtra = (value) => {
    setAppointmentExtras(prev => prev.includes(value) ? prev.filter(x => x !== value) : [...prev, value]);
  };

  const updateOpeningHour = (day, slotIndex, timeIndex, value) => {
    setSettings(prev => ({ ...prev, practiceOpeningHours: { ...prev.practiceOpeningHours, [day]: prev.practiceOpeningHours[day].map((slot, i) => i === slotIndex ? slot.map((time, j) => j === timeIndex ? value : time) : slot) } }));
  };

  const handleLogin = () => {
    const foundUser = users.find(user => user.id === loginId && user.password === loginPassword);
  
    if (!foundUser) {
      setLoginError("Benutzer-ID oder Passwort falsch");
      return;
    }
  
    setLoginLoading(true);
  
    setTimeout(() => {
      setCurrentUser(foundUser);
      setActivePage("Anrufe");
      setIsLoggedIn(true);
      setLoginError("");
      setLoginId("");
      setLoginPassword("");
      setLoginTime(new Date());
      setLoginLoading(false);
    }, 1400);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const getPermissionsByAccessLevel = (level) => {
    if (level === "Admin") return ["Kalender verwalten", "Erweiterte Einstellungen", "Praxisdaten ändern", "Mitgliedschaft einsehen", "Mitarbeiter verwalten"];
    if (level === "Erweitert") return ["Anrufe bearbeiten", "Kalender verwalten", "Kontakte bearbeiten", "Auswertungen ansehen"];
    return ["Anrufe bearbeiten", "Kalender ansehen", "Kontakte ansehen"];
  };

  const restrictedPermissions = ["Anrufe ansehen", "Kalender ansehen", "Dashboard verwalten"];
  
  const handleAccessLevelChange = (level) => {
    setNewEmployeeAccessLevel(level);
  
    if (level === "Admin") {
      setSelectedPermissions([
        "Anrufe ansehen",
        "Anrufe bearbeiten",
        "Kalender verwalten",
        "Kontakte ansehen",
        "Kontakte bearbeiten",
        "Erweiterte Einstellungen",
        "Praxisdaten ändern",
        "Mitgliedschaft einsehen",
        "Mitarbeiter verwalten"
      ]);
    }
  
    if (level === "Eingeschränkt") {
      setSelectedPermissions(restrictedPermissions);
    }
  
    if (level === "Erweitert") {
      setSelectedPermissions([]);
    }
  };
  
  const handleAddEmployee = () => {
    if (!newEmployeeName || !newEmployeeId || !newEmployeePassword) {
      alert("Bitte alles ausfüllen.");
      return;
    }

    if (newEmployeePassword !== newEmployeePasswordRepeat) {
      setPasswordError("Passwörter stimmen nicht überein");
      return;
    } else {
      setPasswordError("");
    }
    
    const newUser = {
      id: newEmployeeId,
      password: newEmployeePassword,
      name: newEmployeeName,
      role: newEmployeeRole,
      accessLevel: newEmployeeAccessLevel,
      permissions: selectedPermissions
    };
  
    setUsers(prev => {
      let updated;
  
      if (editingUserIndex !== null) {
        updated = prev.map((u, i) =>
          i === editingUserIndex ? newUser : u
        );
      } else {
        updated = [...prev, newUser];
      }
  
      return updated;
    });
  
    setEditingUserIndex(null);
    setNewEmployeeName("");
    setNewEmployeeId("");
    setNewEmployeePassword("");
    setShowAddEmployee(false);
    setSelectedPermissions([]);
    setPasswordError("");
    setNewEmployeePasswordRepeat("");
    setShowEmployeePassword(false);  
    setToastMessage("✓ Erfolgreich aktualisiert");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
  };

  const handleAddContact = () => {
    if (!newContactName || !newContactPhone) { alert("Bitte Name und Telefonnummer ausfüllen."); return; }
  
    const newContact = { name: newContactName, phone: newContactPhone, birthdate: newContactBirthdate, existing: newContactExisting, doctor: newContactDoctor, lastContact: "-", calls: [] };
  
    setManualContacts(prev => {
      const updated = editingContactIndex !== null ? prev.map((c, i) => i === editingContactIndex ? newContact : c) : [...prev, newContact];
      const sorted = updated.sort((a, b) => a.name.localeCompare(b.name));
      localStorage.setItem("manualContacts", JSON.stringify(sorted));
      return sorted;
    });
  
    setEditingContactIndex(null);
    setNewContactName("");
    setNewContactPhone("");
    setNewContactBirthdate("");
    setNewContactExisting("Bestandspatient");
    setNewContactDoctor("Frau Dr. Tilse");
    setShowAddContact(false);
  };
  
  if (!isLoggedIn) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f5f7fb", fontFamily: "Inter, Arial, sans-serif" }}>
        <div style={loginCard}>
          <div style={loginHeader}>
            <h2 style={loginTitle}>Anmelden</h2>
            <p style={loginText}>Bitte mit Benutzer-ID und Passwort einloggen.</p>
          </div>
  
          <input
            placeholder="Benutzer-ID"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={input}
          />
          
          <input
            type="password"
            placeholder="Passwort"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{ ...input, marginTop: 10 }}
          />
  
          {loginError && (
            <p style={{ color: "red", fontSize: 13 }}>{loginError}</p>
          )}
  
          <button onClick={handleLogin} style={{ ...addButton, marginTop: 12, width: "100%" }}>
            {loginLoading ? "Wird angemeldet..." : "Einloggen"}
          </button>

          {loginLoading && <div style={loginLoader}></div>}
          
        </div>
      </div>
    );
  }
  
  if (!ready) return null;
  
  return (
    <div style={layout}>
      <aside style={sidebar}>
       <div>
        <h2>Praxis Dr. Tilse</h2>
         <nav>
          <p onClick={() => setActivePage("Anrufe")} onMouseEnter={(e) => activePage !== "Anrufe" && (e.currentTarget.style.background = "#1e293b")} onMouseLeave={(e) => activePage !== "Anrufe" && (e.currentTarget.style.background = "transparent")} style={{ ...(activePage === "Anrufe" ? activeNav : { ...navItem, cursor: "pointer" }), position: "relative" }}><Phone size={18} style={icon}/> Anrufe {data.filter(row => row.status === "Neu / Ungelesen").length > 0 && <span style={sidebarUnreadBadge}>{data.filter(row => row.status === "Neu / Ungelesen").length}</span>}</p>
          <p onClick={() => setActivePage("Kontakte")} onMouseEnter={(e) => activePage !== "Kontakte" && (e.currentTarget.style.background = "#1e293b")} onMouseLeave={(e) => activePage !== "Kontakte" && (e.currentTarget.style.background = "transparent")} style={activePage === "Kontakte" ? activeNav : { ...navItem, cursor: "pointer" }}><Users size={18} style={icon}/> Kontakte</p>
          <p onClick={() => setActivePage("Kalender")} onMouseEnter={(e) => activePage !== "Kalender" && (e.currentTarget.style.background = "#1e293b")} onMouseLeave={(e) => activePage !== "Kalender" && (e.currentTarget.style.background = "transparent")} style={activePage === "Kalender" ? activeNav : { ...navItem, cursor: "pointer" }}><Calendar size={18} style={icon}/> Kalender</p>
        </nav>
        </div>
        <div style={bottomNav}>
        <p onClick={() => setActivePage("Profil")} style={activePage === "Profil" ? activeBottomItem : bottomItem}><User size={18} style={icon}/> Profil</p>
        {currentUser.accessLevel === "Admin" && (
          <p onClick={() => setActivePage("Mitgliedschaft")} style={activePage === "Mitgliedschaft" ? activeNav : bottomItem}>
            <CreditCard size={18} style={icon}/> Mitgliedschaft
          </p>
        )}
        <p onClick={() => { setActivePage("Einstellungen"); setActiveSettingsTab(currentUser.accessLevel === "Admin" ? "Praxisdaten" : "Benachrichtigungen"); }} style={activePage === "Einstellungen" ? activeNav : bottomItem}><Settings size={18} style={icon}/> Einstellungen</p>
        </div>
        </aside>
  
        <main style={main}>
    
        <h1>{activePage}</h1>

        {activePage === "Kalender" && (
          <p style={{ color: "#667085" }}>
            Verwalten Sie die Kalender Ihrer Ärzte.
          </p>
        )}

        {activePage === "Anrufe" && (
          <>
            <p style={{ color: "#667085" }}>Übersicht Ihrer von Anna geführten Anrufe.</p>
        
            <div style={cards}>
              <div style={highlightCard}><p>Anrufe gesamt</p><h2><CountUp value={filteredData.length} /></h2></div>
              <div style={card}><p>Termine</p><h2><CountUp value={kpiTermine} /></h2></div>
              <div style={card}><p>Rezepte</p><h2><CountUp value={kpiRezepte} /></h2></div>
              <div style={card}><p>Atteste</p><h2><CountUp value={kpiAtteste} /></h2></div>
            </div>

            <div style={tabBar}>
              {["Alle", "Neu / Ungelesen", "Gelesen", "In Bearbeitung", "Erledigt"].map(tab => {
                const unreadCount = data.filter(row => row.status === "Neu / Ungelesen").length;
              
                return (
                  <button
                    key={tab}
                    onClick={() => { setKeepVisibleIds([]); setStatusFilter(tab); }}
                    style={{ ...(statusFilter === tab ? activeTab : tabItem), position: "relative" }}
                  >
                    {tab}
              
                    {tab === "Neu / Ungelesen" && unreadCount > 0 && (
                      <span style={unreadBadge}>{unreadCount}</span>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div style={filterRow}>
              <input placeholder="Suche..." value={search} onChange={(e) => setSearch(e.target.value)} style={searchInput} />
            
              <div style={anliegenWrapper}>
                <Filter size={16} style={filterIcon} />
                
                <select
                  value={anliegenFilter === "Alle" ? "" : anliegenFilter}
                  onChange={(e) => setAnliegenFilter(e.target.value || "Alle")}
                  style={anliegenFilter !== "Alle" ? filterActive : filterSelect}
                >
                  <option value="" disabled hidden>Anliegen filtern</option>
                  <option value="Alle">Alle</option>
                  <option value="Termin">Termin</option>
                  <option value="Rezept">Rezept</option>
                  <option value="Attest">Attest</option>
                  <option value="Sonstige">Sonstige</option>
                </select>
              </div>
            
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <User size={16} style={{ position: "absolute", left: 10, color: arztFilter !== "Alle" ? "#2563eb" : "#64748b" }} />
                
                <select
                  value={arztFilter === "Alle" ? "" : arztFilter}
                  onChange={(e) => setArztFilter(e.target.value || "Alle")}
                  style={arztFilter !== "Alle" ? { padding: "10px 12px 10px 32px", borderRadius: 10, border: "1px solid #2563eb", background: "#eff6ff", cursor: "pointer", color: "#1d4ed8", fontWeight: 600 } : { padding: "10px 12px 10px 32px", borderRadius: 10, border: "1px solid #dbe1ea", background: "white", cursor: "pointer" }}
                >
                  <option value="" disabled hidden>Arzt filtern</option>
                  <option value="Alle">Alle</option>
                  <option value="Herr Dr. Tilse">Herr Dr. Tilse</option>
                  <option value="Frau Dr. Tilse">Frau Dr. Tilse</option>
                  <option value="Sonstige">Sonstige</option>
                </select>
              </div>

            <div style={{ position: "relative" }}>
              <button onClick={() => setShowDateMenu(!showDateMenu)} style={datePicker}>Zeitraum</button>
            
              {showDateMenu && (
                <div style={dateMenu}>
                  <div style={dateShortcuts}>
                    {["Heute", "Gestern", "Letzte 7 Tage", "Letzte 30 Tage", "Diese Woche", "Letzte Woche", "Dieser Monat", "Letzter Monat", "Zurücksetzen"].map(item => (
                      <button key={item} onClick={() => setQuickRange(item)} style={quickDateButton}>{item}</button>
                    ))}
                  </div>
            
                  <DatePicker
                    inline
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setDateRange(update)}
                  />
                </div>
              )}
            </div>
            </div>   
                
            <div style={box}>
              <div style={headerRow}>
                <span>Datum</span>
                <span>Name</span>
                <span>Anliegen</span>
                <span>Arzt</span>
                <span>Status</span>
              </div>
              
              {data
                .filter((row) => {
                  const statusMatch =
                    statusFilter === "Alle" ||
                    row.status === statusFilter ||
                    (statusFilter === "Neu / Ungelesen" && keepVisibleIds.includes(row.callId));
                                
                  const searchMatch =
                    (row.Name || "").toLowerCase().includes(search.toLowerCase()) ||
                    (row.Arzt || "").toLowerCase().includes(search.toLowerCase()) ||
                    (row.Anliegen || "").toLowerCase().includes(search.toLowerCase());
              
                  const anliegenMatch =
                    anliegenFilter === "Alle" ||
                    (anliegenFilter === "Sonstige" && (!row.Anliegen || row.Anliegen === "-")) ||
                    (row.Anliegen || "").split(",").map(x => x.trim()).includes(anliegenFilter);
              
                  const arztMatch =
                    arztFilter === "Alle" ||
                    (arztFilter === "Sonstige" && (!row.Arzt || row.Arzt === "-")) ||
                    (row.Arzt || "") === arztFilter;
              
                  const dateMatch =
                    (!startDate && !endDate) ||
                    (() => {
                      const rowDate = parseGermanDate(row.Datum);
                      return rowDate && (!startDate || rowDate >= startDate) && (!endDate || rowDate <= endDate);
                    })();
              
                  return statusMatch && searchMatch && anliegenMatch && arztMatch && dateMatch;
                })
                .map((row) => (
                  <div
                    key={row.callId}
                    style={{
                      ...(openIndex === row.callId ? callCardOpen : callCard),
                      ...(row.status === "Neu / Ungelesen" && {
                        borderLeft: "4px solid #2563eb",
                        background: "#eff6ff"
                      })
                    }}
                    onMouseEnter={(e) => {
                      if (openIndex !== row.callId && row.status !== "Neu / Ungelesen") {
                        e.currentTarget.style.background = "#f8fafc";
                      }
                    }}

                    onMouseLeave={(e) => {
                      if (openIndex !== row.callId && row.status !== "Neu / Ungelesen") {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.borderBottom = "1px solid #e5e7eb";
                      }
                    }}

                    onClick={() => {
                      setOpenIndex(openIndex === row.callId ? null : row.callId);
              
                      if (row.status === "Neu / Ungelesen") {
                        if (statusFilter === "Neu / Ungelesen") {
                          setKeepVisibleIds(prev => [...prev, row.callId]);
                        }
                      
                        updateStatus(row.callId, "Gelesen");
                      }
                    }}
                  >
                    <div style={callTop}>
                      <div>
                        <strong>{row.Uhrzeit || "-"}</strong>
                        <div style={dateText}>{row.Datum || "-"}</div>
                      </div>
              
                      <span>{row.Name || "-"}</span>
              
                      <span style={{ display: "flex", gap: 6, flexWrap: "nowrap" }}>
                        {(row.Anliegen || "")
                          .split(",")
                          .map(item => item.trim())
                          .filter(Boolean)
                          .sort((a, b) => a.localeCompare(b))
                          .map((item, i) => (
                            <span
                              key={i}
                              style={{ ...badge,
                                background: item === "Termin" ? "#e0f2fe" : item === "Rezept" ? "#dcfce7" : item === "Attest" ? "#fef9c3" : "#e5e7eb",
                                color: item === "Termin" ? "#0369a1" : item === "Rezept" ? "#166534" : item === "Attest" ? "#854d0e" : "#374151",
                                border: item === "Termin" ? "1px solid #7dd3fc" : item === "Rezept" ? "1px solid #86efac" : item === "Attest" ? "1px solid #fde047" : "1px solid #d1d5db"
                              }}
                            >
                            {item.trim() || "-"}
                          </span>
                        ))}
                      </span>
              
                      <span>{row.Arzt || "-"}</span>
              
                      <select
                        value={row.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateStatus(row.callId, e.target.value)}
                        style={selectStyle}
                      >
                        <option>Neu / Ungelesen</option>
                        <option>Gelesen</option>
                        <option>In Bearbeitung</option>
                        <option>Erledigt</option>
                      </select>
                    </div>
              
                    {openIndex === row.callId && (
                      <div style={details}>
                        <div style={detailCard}>
                          <span style={detailLabel}>Bestandspatient</span>
                          <strong>{row.Bestandspatient || "-"}</strong>
                        </div>
                        
                        <div style={detailCard}>
                          <span style={detailLabel}>Geburtsdatum</span>
                          <strong>{row.Geburtsdatum || "-"}</strong>
                        </div>
                        
                        <div style={detailCard}>
                          <span style={detailLabel}>Telefonnummer</span>
                          <strong>{row.Telefonnummer || "-"}</strong>
                        </div>
                        
                        <div style={detailCard}>
                          <span style={detailLabel}>Anruf-ID</span>
                          <strong>{row.callId}</strong>
                        </div>
                        
                        <div style={detailCardWide}>
                          <span style={detailLabel}>Zusammenfassung</span>
                          <p>{row.Zusammenfassung || "-"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </>
        )}

        {activePage === "Kontakte" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <p style={{ color: "#667085", margin: 0 }}>Übersicht Ihrer Patienten- und Kontaktanfragen.</p>
              <button onClick={() => setShowAddContact(true)} style={addButton}>+ Kontakt hinzufügen</button>
            </div>
        
            <div style={filterRow}>
              <input placeholder="Kontakt suchen..." value={contactSearch} onChange={(e) => setContactSearch(e.target.value)} style={searchInput} />
        
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <User size={16} style={{ position: "absolute", left: 10, color: contactDoctorFilter !== "Alle" ? "#2563eb" : "#64748b" }} />
                <select
                  value={contactDoctorFilter === "Alle" ? "" : contactDoctorFilter}
                  onChange={(e) => setContactDoctorFilter(e.target.value || "Alle")}
                  style={contactDoctorFilter !== "Alle" ? filterActive : filterSelect}
                >
                  <option value="" disabled hidden>Ärzte filtern</option>
                  <option value="Alle">Alle</option>
                  <option value="Herr Dr. Tilse">Herr Dr. Tilse</option>
                  <option value="Frau Dr. Tilse">Frau Dr. Tilse</option>
                  <option value="Sonstige">Sonstige</option>
                </select>
              </div>

              
        
              <div style={anliegenWrapper}>
                <Users size={16} style={filterIcon} />
                <select
                  value={contactExistingFilter === "Alle" ? "" : contactExistingFilter}
                  onChange={(e) => setContactExistingFilter(e.target.value || "Alle")}
                  style={contactExistingFilter !== "Alle" ? filterActive : filterSelect}
                >
                  <option value="" disabled hidden>Patientenstatus</option>
                  <option value="Alle">Alle</option>
                  <option value="Bestandspatient">Bestandspatient</option>
                  <option value="Neupatient">Neupatient</option>
                </select>
              </div>

              <div style={anliegenWrapper}>
                <ArrowUpDown size={16} style={filterIcon} />
                <select value={contactSort} onChange={(e) => setContactSort(e.target.value)} style={filterSelect}>
                  <option value="nameAZ">Name A-Z</option>
                  <option value="nameZA">Name Z-A</option>
                </select>
              </div>
            </div>
        
            <div style={box}>
              <div style={contactHeaderRow}>
                <span>Name</span>
                <span>Telefonnummer</span>
                <span>Geburtsdatum</span>
                <span>Patientenstatus</span>
                <span>Arzt</span>
                <span>Anrufhistorie</span>
              </div>
        
              {[...manualContacts, ...contacts]
                .sort((a, b) => { if (contactSort === "nameAZ") return a.name.localeCompare(b.name); if (contactSort === "nameZA") return b.name.localeCompare(a.name); return 0; })
                
                .filter(c => {
                  const searchValue = contactSearch.toLowerCase();
                  
                  const searchMatch =
                    (c.name || "").toLowerCase().includes(searchValue) ||
                    (c.phone || "").toLowerCase().includes(searchValue) ||
                    (c.birthdate || "").toLowerCase().includes(searchValue) ||
                    (c.existing || "").toLowerCase().includes(searchValue) ||
                    (c.doctor || "").toLowerCase().includes(searchValue);
        
                  const doctorMatch =
                    contactDoctorFilter === "Alle" ||
                    c.doctor === contactDoctorFilter ||
                    (contactDoctorFilter === "Sonstige" && (!c.doctor || c.doctor === "-"));
        
                  const existingMatch =
                    contactExistingFilter === "Alle" ||
                    (contactExistingFilter === "Neupatient" && (!c.existing || c.existing === "-")) ||
                    (c.existing || "").trim() === contactExistingFilter;
        
                  return searchMatch && doctorMatch && existingMatch;
                })
                
                .map((c, i) => {
                  const manualIndex = manualContacts.findIndex(m =>
                    String(m.phone).replace(/\s/g, "") === String(c.phone).replace(/\s/g, "")
                  );
                                  
                  return (
                    <div key={i} style={contactRow}>
                      <span style={{ fontWeight: 700 }}>{c.name}</span>
                      <span>{c.phone || "-"}</span>
                      <span>{c.birthdate || "-"}</span>
                      <span>{c.existing}</span>
                      <span>{c.doctor}</span>
                
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setSelectedContact(c)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #bfdbfe", background: "#eff6ff", color: "#1d4ed8", cursor: "pointer", fontWeight: 600 }}>
                          Historie
                        </button>
                      </div>
                    </div>
                  );
              })}
            </div>
          </>
        )}

        {activePage === "Profil" && (
          <div style={box}>
            <p style={{ ...settingsText, marginTop: -4, marginBottom: 24 }}>
              Übersicht des aktuell angemeldeten Nutzers und seiner Zugriffsrechte.
            </p>
        
            <div style={profileGrid}>
              <div style={profileCard}>
                <h3 style={settingsTitle}>Angemeldeter Nutzer</h3>
                <p style={settingsText}>Name</p>
                <strong>{currentUser.name}</strong>
        
                <p style={settingsText}>Rolle</p>
                <strong>{currentUser.role}</strong>
        
                <p style={settingsText}>Zugriffsstufe</p>
                <span style={adminBadge}>{currentUser.accessLevel}</span>
              </div>
        
              <div style={profileCard}>
                <h3 style={settingsTitle}>Berechtigungen</h3>
              
                {currentUser.permissions.map(item => (
                  <p key={item}>✓ {item}</p>
                ))}
              </div>
        
              <div style={profileCard}>
                <h3 style={settingsTitle}>Sitzung</h3>
                <p style={settingsText}>Eingeloggt seit</p>
                <strong>08:42 Uhr</strong>
        
                <p style={settingsText}>Letzte Aktivität</p>
                <strong>Gerade eben</strong>
              </div>
            </div>
          </div>
        )}

        {activePage === "Mitgliedschaft" && (
          <div style={box}>
            <p style={{ color: "#64748b", marginTop: -4, marginBottom: 24 }}>
              Ihr aktuelles Paket: <strong>Standard</strong>
            </p>
        
            <div style={membershipGrid}>
              {[
                { name: "Basic", price: "399 €", doctors: "1 Arzt", minutes: "350 Minuten / Monat", desc: "Für kleine Einzelpraxen mit geringem Anrufvolumen.", features: ["Anrufübersicht", "Kalender-Anbindung"], icon: <Shield size={28} />, active: false, action: "Downgrade anfragen" },
                { name: "Standard", price: "599 €", doctors: "bis zu 3 Ärzte", minutes: "1.050 Minuten / Monat", desc: "Für Gemeinschaftspraxen mit mehreren Behandlern.", features: ["Anrufübersicht", "Kalender-Anbindung", "Erweiterte Auswertung", "Tagesprotokolle", "Priorisierte Verarbeitung"], icon: <Star size={28} />, active: true, action: "Aktuelles Paket" },
                { name: "Premium", price: "999 €", doctors: "bis zu 10 Ärzte", minutes: "3.500 Minuten / Monat", desc: "Für große Praxen oder MVZs mit hohem Anrufaufkommen.", features: ["Anrufübersicht", "Kalender-Anbindung", "Erweiterte Auswertung", "Tagesprotokolle", "Priorisierte Verarbeitung", "Mehrere Standorte möglich", "Individueller Support", "Erweiterte Statistiken"], icon: <Crown size={28} />, active: false, action: "Upgrade anfragen" }
              ].map(plan => (
                <div key={plan.name} style={plan.active ? membershipCardActive : membershipCard}>
                  <div style={membershipIcon}>{plan.icon}</div>
                  <h3 style={membershipTitle}>{plan.name}</h3>
                  <p style={membershipDesc}>{plan.desc}</p>
                  <h2 style={membershipPrice}>{plan.price}<span style={membershipMonth}> / Monat</span></h2>
                  <p style={highlightInfo}>{plan.doctors}</p>
                  <p style={highlightInfo}>{plan.minutes}</p>
        
                  <div style={featureList}>
                    {plan.features.map(item => (
                      <p key={item} style={featureItem}>✓ {item}</p>
                    ))}
                  </div>
        
                  <div style={planButtonWrap}>
                    <button style={plan.active ? disabledPlanButton : planButton} onClick={() => { if (!plan.active) setPendingPlan(plan.name); }}>
                      {plan.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === "Einstellungen" && (
          <div style={box}>
        
            <div style={tabBar}>
              {(currentUser.accessLevel === "Admin"
                ? ["Praxisdaten", "Benachrichtigungen", "Dashboard", "Profilverwaltung", "Konto"]
                : ["Benachrichtigungen", "Dashboard", "Konto"]
              ).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveSettingsTab(tab)}
                  style={activeSettingsTab === tab ? activeTab : tabItem}
                >
                  {tab}
                </button>
              ))}
            </div>
        
            {activeSettingsTab === "Benachrichtigungen" && (
              <div style={settingsGrid}>
                <div style={settingsCard}>
                  <div>
                    <h3 style={settingsTitle}>Neue Anrufe</h3>
                    <p style={settingsText}>Zeigt eine Benachrichtigung im Dashboard an, sobald ein neuer Anruf eingegangen ist. So sieht das Praxisteam sofort, wenn neue Patientenanliegen vorliegen.</p>
                  </div>
                  <div
                    onClick={() => {
                      setSettings({ ...settings, emailNewCalls: !settings.emailNewCalls });
                    }}
                    style={toggleSwitch(settings.emailNewCalls)}
                  >
                    <div style={toggleCircle}></div>
                  </div>
                </div>
            
                <div style={settingsCard}>
                  <div>
                    <h3 style={settingsTitle}>Tagesübersicht per E-Mail</h3>
                    <p style={settingsText}>Sendet am Ende des Tages eine kompakte Zusammenfassung aller eingegangenen Anrufe, Termine, Rezeptwünsche und offenen Anliegen.</p>
                  </div>
                  <div
                    onClick={() => {
                      setSettings({ ...settings, dailySummary: !settings.dailySummary });
                    }}
                    style={toggleSwitch(settings.dailySummary)}
                  >
                    <div style={toggleCircle}></div>
                  </div>
                </div>
            
                <div style={settingsCard}>
                  <div>
                    <h3 style={settingsTitle}>Offene Rückrufe hervorheben</h3>
                    <p style={settingsText}>Markiert Rückruf-Anliegen besonders sichtbar, damit wichtige Patientenrückmeldungen im Praxisalltag nicht untergehen.</p>
                  </div>
                  <div onClick={() => {
                    setSettings({ ...settings, highlightCallbacks: !settings.highlightCallbacks });
                  }} style={toggleSwitch(settings.highlightCallbacks)}>                    
                  <div style={toggleCircle}></div>
                  </div>
                </div>
            
                <div style={settingsActions}>
                  <button onClick={saveSettings} style={smallSaveButton}>Speichern</button>
                </div>
              </div>
            )}
        
            {activeSettingsTab === "Dashboard" && (
              <div style={settingsGrid}>
                <div style={settingsCard}>
                  <div>
                    <h3 style={settingsTitle}>Startseite</h3>
                    <p style={settingsText}>Bereich, der beim Öffnen automatisch angezeigt wird.</p>
                  </div>
                  <select value={settings.startPage} onChange={(e) => setSettings({ ...settings, startPage: e.target.value })} style={smallSelect}>
                    <option>Anrufe</option>
                    <option>Kalender</option>
                  </select>
                </div>
            
                <div style={settingsCard}>
                  <div>
                    <h3 style={settingsTitle}>Einträge pro Seite</h3>
                    <p style={settingsText}>Wie viele Anrufe angezeigt werden sollen.</p>
                  </div>
                  <select value={settings.entriesPerPage} onChange={(e) => setSettings({ ...settings, entriesPerPage: e.target.value })} style={smallSelect}>
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                </div>
                      
                <div style={settingsActions}>
                  <button onClick={saveSettings} style={smallSaveButton}>Speichern</button>
                </div>
              </div>
            )}

            {currentUser.accessLevel === "Admin" && activeSettingsTab === "Praxisdaten" && (
              <div style={settingsGrid}>
                <div style={settingsCardColumn}>
                  <div style={settingsTwoColumn}>
                    <div>
                      <h3 style={settingsTitle}>Praxisdaten</h3>
                      <p style={settingsText}>Hier können Änderungswünsche zu den Stammdaten der Praxis eingetragen werden. Die Änderung wird durch unser Support-Team geprüft.</p>
                    </div>
                  
                    <div style={settingsFormGrid}>
                      <div>
                        <label style={formLabel}>Praxisname</label>
                        <input value={settings.practiceName} onChange={(e) => setSettings({ ...settings, practiceName: e.target.value })} style={input} />
                      </div>
                      
                      <div>
                        <label style={formLabel}>Adresse</label>
                        <input value={settings.practiceAddress} onChange={(e) => setSettings({ ...settings, practiceAddress: e.target.value })} style={input} />
                      </div>
                      
                      <div>
                        <label style={formLabel}>E-Mail-Adresse</label>
                        <input value={settings.practiceEmail} onChange={(e) => setSettings({ ...settings, practiceEmail: e.target.value })} style={input} />
                      </div>
                      
                      <div>
                        <label style={formLabel}>Telefonnummer</label>
                        <input value={settings.practicePhone} onChange={(e) => setSettings({ ...settings, practicePhone: e.target.value })} style={input} />
                      </div>
                      
                      <div>
                        <label style={formLabel}>Webseite</label>
                        <input value={settings.practiceWebsite} onChange={(e) => setSettings({ ...settings, practiceWebsite: e.target.value })} style={input} />
                      </div>
                    </div>
                  </div>
                  
                  <div style={settingsDivider}></div>
                  
                  <div style={settingsTwoColumn}>
                    <div>
                      <h3 style={settingsTitle}>Öffnungszeiten</h3>
                      <p style={settingsText}>Pro Wochentag können zwei Zeitfenster ausgewählt werden, zum Beispiel vormittags und nachmittags.</p>
                    </div>
                  
                    <div>
                      {["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"].map(day => (
                        <div key={day} style={openingRowDouble}>
                          <span style={openingDay}>{day}</span>
                      
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {[0, 1].map(slotIndex => (
                              <div key={slotIndex} style={{ display: "grid", gridTemplateColumns: "120px 70px 120px", gap: 10, alignItems: "center" }}>
                                <select value={settings.practiceOpeningHours?.[day]?.[slotIndex]?.[0] || "Geschlossen"} onChange={(e) => updateOpeningHour(day, slotIndex, 0, e.target.value)} style={input}>
                                  {timeOptions.map(t => <option key={t}>{t}</option>)}
                                </select>
                      
                                <span style={{ textAlign: "center" }}>bis</span>
                      
                                <select value={settings.practiceOpeningHours?.[day]?.[slotIndex]?.[1] || "Geschlossen"} onChange={(e) => updateOpeningHour(day, slotIndex, 1, e.target.value)} style={input}>
                                  {timeOptions.map(t => <option key={t}>{t}</option>)}
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
            
                  <div style={infoBox}>Diese Änderung wird durch unser Support-Team geprüft. Die Daten werden erst nach Freigabe übernommen.</div>
            
                  <div style={settingsActions}>
                    <button
                      style={smallSaveButton}
                      onClick={() => {
                        const body = `
            Praxisdaten-Änderungsanfrage:
            
            Praxisname: ${settings.practiceName}
            Telefonnummer: ${settings.practicePhone}
            E-Mail: ${settings.practiceEmail}
            Webseite: ${settings.practiceWebsite}
            Adresse: ${settings.practiceAddress}
            Öffnungszeiten: ${settings.practiceOpeningHours || "-"}
            `;
                        setToastMessage("✓ Erfolgreich an Support gesendet");
                        setShowToast(true);
                        setTimeout(() => {
                          setShowToast(false);
                        }, 1800);
                      }}
                    >
                      Änderung an Support senden
                    </button>
                  </div>
                </div>
              </div>
            )}

                    {activeSettingsTab === "Konto" && (
                      <div style={settingsGrid}>
                        <div style={settingsCard}>
                          <div>
                            <h3 style={settingsTitle}>Datenschutz</h3>
                            <p style={settingsText}>Datenexport oder Löschung kann beim Support angefragt werden.</p>
                          </div>
                        </div>
        
                        <div style={settingsCard}>
                          <div>
                            <h3 style={settingsTitle}>Abmelden</h3>
                            <p style={settingsText}>Aktuelle Sitzung beenden.</p>
                          </div>
                          <button onClick={handleLogout} style={cancelButton}>Abmelden</button>
                        </div>
                      </div>
                    )}

                    {currentUser.accessLevel === "Admin" && activeSettingsTab === "Profilverwaltung" && (
                      <div style={settingsGrid}>
                    
                        {users.map((user, index) => (
                          <div key={index} style={settingsCard}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              <strong style={{ fontSize: 16 }}>{user.name}</strong>
                            
                              <span style={{ fontSize: 14, color: "#475569" }}>
                                {user.role}
                              </span>
                            
                              <span
                                style={{
                                  marginTop: 4,
                                  display: "inline-block",
                                  padding: "6px 10px",
                                  borderRadius: 999,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  width: "fit-content",
                                  background:
                                    user.accessLevel === "Admin"
                                      ? "#dcfce7"
                                      : user.accessLevel === "Erweitert"
                                      ? "#dbeafe"
                                      : "#fef3c7",
                                  color:
                                    user.accessLevel === "Admin"
                                      ? "#166534"
                                      : user.accessLevel === "Erweitert"
                                      ? "#1d4ed8"
                                      : "#92400e"
                                }}
                              >
                                {user.accessLevel}
                              </span>
                            </div>
                                                
                            <button
                              onClick={() => {
                                setEditingUserIndex(index);
                                setNewEmployeeName(user.name);
                                setNewEmployeeId(user.id);
                                setNewEmployeePassword(user.password);
                                setNewEmployeePasswordRepeat(user.password);
                                setNewEmployeeRole(user.role);
                                setNewEmployeeAccessLevel(user.accessLevel);
                                setSelectedPermissions(user.permissions || []);
                                setShowAddEmployee(true);
                              }}
                              style={addButton}
                            >
                              Bearbeiten
                            </button>
                          </div>
                        ))}
                    
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                          <button
                            onClick={() => {
                              setEditingUserIndex(null);
                              setNewEmployeeName("");
                              setNewEmployeeId("");
                              setNewEmployeePassword("");
                              setNewEmployeeRole("Mitarbeiterin");
                              setNewEmployeeAccessLevel("Eingeschränkt");
                              setSelectedPermissions([]);
                              setPasswordError("");
                              setShowAddEmployee(true);
                            }}
                            style={addButton}
                          >
                            + Profil hinzufügen
                          </button>
                        </div>
                    
                      </div>
                    )}
                                          
                  </div>
                )}

        {activePage === "Kalender" && (
          <div style={box}>
                
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              
              <div style={tabBar}>
                {["Frau Dr. Tilse", "Herr Dr. Tilse"].map(item => (
                  <button
                    key={item}
                    onClick={() => setActiveCalendar(item)}
                    style={activeCalendar === item ? activeTab : tabItem}
                  >
                    {item}
                  </button>
                ))}
              </div>
            
              <button
                style={addButton}
                onClick={() => setShowAddAppointment(true)}
              >
                + Termin hinzufügen
              </button>
            
            </div>
        
            <iframe
              src={activeCalendar === "Frau Dr. Tilse" ? "https://calendar.google.com/calendar/embed?src=a97f878565c5dac9bd5b57532837c0cc811565a1b452232db18de9f294d2dbc8%40group.calendar.google.com&ctz=Europe%2FBerlin" : "https://calendar.google.com/calendar/embed?src=ee8c28099ea055a6a6d06eb21cd9038cd860247aabacc309edd6283b1dd9f30b%40group.calendar.google.com&ctz=Europe%2FBerlin"}
              style={{ border: 0, width: "100%", height: 650, borderRadius: 14 }}
              frameBorder="0"
              scrolling="no"
            />
          </div>
        )}

        {showAddAppointment && (
          <div style={modalOverlay}>
            <div style={modal}>
              <div style={modalHeader}>
                <div>
                  <h2 style={{ margin: 0 }}>Termin hinzufügen</h2>
                </div>
                <button onClick={() => setShowAddAppointment(false)} style={closeButton}>×</button>
              </div>
        
              <div style={formSection}>
                <p style={sectionTitle}>Patientendaten</p>
              
                <div style={formGrid}>
                  <div>
                    <label style={formLabel}>Name des Patienten</label>
                    <input placeholder="z. B. Max Mustermann" value={appointmentPatient} onChange={(e) => setAppointmentPatient(e.target.value)} style={input} />
                  </div>
              
                  <div>
                    <label style={formLabel}>Bestandspatient</label>
                    <select value={appointmentExisting} onChange={(e) => setAppointmentExisting(e.target.value)} style={input}>
                      <option>Ja</option>
                      <option>Nein</option>
                    </select>
                  </div>
              
                  <div>
                    <label style={formLabel}>Geburtsdatum</label>
                    <input type="date" value={appointmentBirthdate} onChange={(e) => setAppointmentBirthdate(e.target.value)} style={input} />
                  </div>
          
                </div>
              </div>
              
              <div style={formSection}>
                <p style={sectionTitle}>Termindaten</p>
              
                <div style={formGrid}>
                  <div>
                    <label style={formLabel}>Datum</label>
                    <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} style={input} />
                  </div>
              
                  <div>
                    <label style={formLabel}>Uhrzeit</label>
                    <select value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} style={input}>
                      <option value="">Uhrzeit auswählen</option>
                      {appointmentTimes.map(time => (
                        <option key={time} value={time}>{time} Uhr</option>
                      ))}
                    </select>
                  </div>
              
                  <div>
                    <label style={formLabel}>Arzt</label>
                    <select value={appointmentDoctor} onChange={(e) => setAppointmentDoctor(e.target.value)} style={input}>
                      <option>Frau Dr. Tilse</option>
                      <option>Herr Dr. Tilse</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div style={formSection}>
                <p style={sectionTitle}>Anmerkung</p>
              
                <div style={{ marginBottom: 14 }}>
                  <label style={formLabel}>Zusätzlich gewünscht</label>
              
                  <div style={{ display: "flex", gap: 10 }}>
                    <label style={checkOption}>
                      <input type="checkbox" checked={appointmentExtras.includes("Rezept")} onChange={() => toggleExtra("Rezept")} />
                      Rezept
                    </label>
              
                    <label style={checkOption}>
                      <input type="checkbox" checked={appointmentExtras.includes("Attest")} onChange={() => toggleExtra("Attest")} />
                      Attest
                    </label>
                  </div>
                </div>
              
                <label style={formLabel}>Notiz</label>
                <textarea placeholder="Notiz / Beschreibung" value={appointmentNote} onChange={(e) => setAppointmentNote(e.target.value)} style={textareaFull} />
              </div>

              <div style={modalActions}>
                <button onClick={() => setShowAddAppointment(false)} style={cancelButton}>Abbrechen</button>
                <button
                  style={addButton}
                  onClick={() => {
                    if (!appointmentPatient || !appointmentDate || !appointmentTime) {
                      alert("Bitte Name, Datum und Uhrzeit ausfüllen.");
                      return;
                    }
                
                    const calendarId =
                      appointmentDoctor === "Frau Dr. Tilse"
                        ? "a97f878565c5dac9bd5b57532837c0cc811565a1b452232db18de9f294d2dbc8@group.calendar.google.com"
                        : "ee8c28099ea055a6a6d06eb21cd9038cd860247aabacc309edd6283b1dd9f30b@group.calendar.google.com";
                
                    const start = `${appointmentDate}T${appointmentTime}:00`;
                    const endDate = new Date(start);
                    endDate.setMinutes(endDate.getMinutes() + 15);
                
                    const end = endDate.toISOString().replace(/[-:]|\.\d{3}/g, "");
                
                    const startFormatted = `${appointmentDate.replaceAll("-", "")}T${appointmentTime.replace(":", "")}00`;
                
                    const details = `
                Patient: ${appointmentPatient}
                Bestandspatient: ${appointmentExisting}
                Geburtsdatum: ${appointmentBirthdate || "-"}
                Zusätzlich gewünscht: ${appointmentExtras.length ? appointmentExtras.join(", ") : "-"}
                Notiz: ${appointmentNote || "-"}
                `;
                
                    const url = `https://calendar.google.com/calendar/u/0/r/eventedit?src=${calendarId}&text=${encodeURIComponent(appointmentPatient)}&dates=${startFormatted}/${end}&details=${encodeURIComponent(details)}`;
                
                    window.open(url, "_blank");
                  }}
                >
                  Termin speichern
                </button>
              </div>
            </div>
          </div>
        )}  

        {showAddEmployee && (
          <div style={modalOverlay}>
            <div style={modal}>
              <div style={modalHeader}>
                <h2 style={{ margin: 0 }}>Mitarbeiter hinzufügen</h2>
                <button onClick={() => setShowAddEmployee(false)} style={closeButton}>×</button>
              </div>
        
              <div style={formSection}>
                <p style={sectionTitle}>Zugangsdaten</p>
        
                <div style={formGrid}>
                  <div>
                    <label style={formLabel}>Name</label>
                    <input value={newEmployeeName} onChange={(e) => setNewEmployeeName(e.target.value)} placeholder="z. B. Herr Becker" style={input} />
                  </div>
        
                  <div>
                    <label style={formLabel}>Benutzer-ID</label>
                    <input value={newEmployeeId} onChange={(e) => setNewEmployeeId(e.target.value)} placeholder="z. B. becker" style={input} />
                  </div>
        
                  <div>
                    <label style={formLabel}>Passwort</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showEmployeePassword ? "text" : "password"}
                        value={newEmployeePassword}
                        onChange={(e) => setNewEmployeePassword(e.target.value)}
                        placeholder="Passwort eingeben"
                        style={{ ...input, paddingRight: 42 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowEmployeePassword(!showEmployeePassword)}
                        style={{
                          position: "absolute",
                          right: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          color: "#64748b"
                        }}
                      >
                        {showEmployeePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label style={formLabel}>Passwort wiederholen</label>
                    <input
                      type={showEmployeePassword ? "text" : "password"}
                      value={newEmployeePasswordRepeat}
                      onChange={(e) => {
                        setNewEmployeePasswordRepeat(e.target.value);
                  
                        if (passwordError) {
                          setPasswordError("");
                        }
                      }}
                      placeholder="Passwort erneut eingeben"
                      style={{
                        ...input,
                        border: passwordError ? "1px solid #dc2626" : input.border
                      }}
                    />
                  
                    {passwordError && (
                      <p style={{ color: "#dc2626", fontSize: 13, marginTop: 6 }}>
                        {passwordError}
                      </p>
                    )}
                  </div>
        
                  <div>
                    <label style={formLabel}>Funktion</label>
                    <select value={newEmployeeRole} onChange={(e) => setNewEmployeeRole(e.target.value)} style={input}>
                      <option>Arzt</option>
                      <option>Ärztin</option>
                      <option>Mitarbeiterin</option>
                      <option>Mitarbeiter</option>
                      <option>Praxismanagerin</option>
                    </select>
                  </div>
        
                  <div>
                    <label style={formLabel}>Zugriffsstufe</label>
                    <select
                      value={newEmployeeAccessLevel}
                      onChange={(e) => handleAccessLevelChange(e.target.value)}
                      style={input}
                    >
                      <option>Eingeschränkt</option>
                      <option>Erweitert</option>
                      <option>Admin</option>
                    </select>
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={formLabel}>Berechtigungen</label>
                  
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {[
                        "Anrufe bearbeiten",
                        "Kalender verwalten",
                        "Kontakte ansehen",
                        "Kontakte bearbeiten",
                        "Erweiterte Einstellungen",
                        "Praxisdaten ändern",
                        "Mitgliedschaft einsehen",
                        "Mitarbeiter verwalten",
                      ].map(permission => (
                        <label key={permission} style={checkOption}>
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission)}
                            onChange={() => {
                              setSelectedPermissions(prev => {
                                const updated = prev.includes(permission)
                                  ? prev.filter(p => p !== permission)
                                  : [...prev, permission];
                            
                                if (
                                  newEmployeeAccessLevel === "Eingeschränkt" &&
                                  !restrictedPermissions.includes(permission)
                                ) {
                                  setNewEmployeeAccessLevel("Erweitert");
                                }
                            
                                return updated;
                              });
                            }}
                          />
                          {permission}
                        </label>
                      ))}
                    </div>
                  </div>
                  
                </div>
              </div>
        
              <div style={modalActions}>
                <button onClick={() => setShowAddEmployee(false)} style={cancelButton}>
                  Abbrechen
                </button>
              
                {editingUserIndex !== null && (
                  <button
                    onClick={() => setConfirmDeleteUserIndex(editingUserIndex)}
                    style={deleteButton}
                  >
                    Mitarbeiter löschen
                  </button>
                )}
              
                <button onClick={handleAddEmployee} style={addButton}>
                  {editingUserIndex !== null ? "Änderungen speichern" : "Mitarbeiter hinzufügen"}
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmDeleteUserIndex !== null && (
          <div style={modalOverlay}>
            <div style={confirmModal}>
              <h3 style={{ marginTop: 0 }}>Mitarbeiter löschen?</h3>
              <p style={settingsText}>
                Möchten Sie diesen Mitarbeiter wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              <div style={modalActions}>
                <button onClick={() => setConfirmDeleteUserIndex(null)} style={cancelButton}>
                  Abbrechen
                </button>
                <button
                  onClick={() => {
                    setUsers(prev => prev.filter((_, i) => i !== confirmDeleteUserIndex));
                    setConfirmDeleteUserIndex(null);
                    setShowAddEmployee(false);
                    setEditingUserIndex(null);
                    setToastMessage("✓ Mitarbeiter gelöscht");
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 1800);
                  }}
                  style={deleteButton}
                >
                  Ja, löschen
                </button>
              </div>
            </div>
          </div>
        )}

        {pendingPlan && (
          <div style={modalOverlay}>
            <div style={confirmModal}>
              <h3 style={{ marginTop: 0 }}>Paketänderung anfragen?</h3>
              <p style={settingsText}>Möchten Sie eine Anfrage an unsere Vertriebsabteilung senden? Ein zuständiger Vertriebsmitarbeiter meldet sich anschließend bei Ihnen.</p>
              <div style={modalActions}>
                <button onClick={() => setPendingPlan(null)} style={cancelButton}>Nein</button>
                <button onClick={() => { setPendingPlan(null); setToastMessage("✓ Anfrage an Vertrieb gesendet"); setShowToast(true); setTimeout(() => setShowToast(false), 1800); }} style={addButton}>Ja, Anfrage senden</button>
              </div>
            </div>
          </div>
        )}

        {showAddContact && (
          <div style={modalOverlay}>
            <div style={modal}>
              <div style={modalHeader}>
                <h2 style={{ margin: 0 }}>Kontakt hinzufügen</h2>
                <button onClick={() => setShowAddContact(false)} style={closeButton}>×</button>
              </div>
        
              <div style={contactAddGrid}>
                <div><label style={formLabel}>Name</label><input value={newContactName} onChange={(e) => setNewContactName(e.target.value)} style={input} /></div>
                <div><label style={formLabel}>Telefonnummer</label><input value={newContactPhone} onChange={(e) => setNewContactPhone(e.target.value)} style={input} /></div>
                <div><label style={formLabel}>Geburtsdatum</label><input placeholder="TT.MM.JJJJ" value={newContactBirthdate} onChange={(e) => setNewContactBirthdate(e.target.value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{2})\.(\d{2})(\d)/, "$1.$2.$3").slice(0, 10))} style={input} /></div>
                <div><label style={formLabel}>Patientenstatus</label><select value={newContactExisting} onChange={(e) => setNewContactExisting(e.target.value)} style={input}><option>Bestandspatient</option><option>Neupatient</option></select></div>
                <div><label style={formLabel}>Zuständiger Arzt</label><select value={newContactDoctor} onChange={(e) => setNewContactDoctor(e.target.value)} style={input}><option>Frau Dr. Tilse</option><option>Herr Dr. Tilse</option></select></div>
              </div>
        
              <div style={modalActions}>
                <button onClick={() => setShowAddContact(false)} style={cancelButton}>Abbrechen</button>
                <button onClick={handleAddContact} style={addButton}>Speichern</button>
              </div>
            </div>
          </div>
        )}

        {selectedContact && (
          <div style={modalOverlay}>
            <div style={{ ...modal, width: 760, maxHeight: "85vh", overflowY: "auto" }}>
              <div style={modalHeader}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Patient</p>
                  <h2 style={{ margin: "2px 0 0", fontSize: 30, fontWeight: 800 }}>{selectedContact.name}</h2>
                </div>
        
                <button onClick={() => setSelectedContact(null)} style={closeButton}>×</button>
              </div>
        
              <div style={patientSection}>
                <p style={patientSectionTitle}>Daten</p>
        
                <div style={patientDataGrid}>
                  <div style={detailCard}><span style={detailLabel}>Telefonnummer</span><strong>{selectedContact.phone || "-"}</strong></div>
                  <div style={detailCard}><span style={detailLabel}>Geburtsdatum</span><strong>{selectedContact.birthdate || "-"}</strong></div>
                  <div style={detailCard}><span style={detailLabel}>Patientenstatus</span><strong>{selectedContact.existing || "-"}</strong></div>
                  <div style={detailCard}><span style={detailLabel}>Zuständiger Arzt</span><strong>{selectedContact.doctor || "-"}</strong></div>
                </div>
              </div>
        
              <div style={historySection}>
                <p style={historySectionTitle}>Anrufhistorie</p>
        
                <div style={historyList}>
                  {(selectedContact.calls || []).map((call, index) => (
                    <div key={index} style={timelineItem}>
                      <div style={timelineLeft}>
                        <div style={timelineDot}></div>
                        <strong>{call.Datum || "-"}</strong>
                        <span>{call.Uhrzeit || "-"}</span>
                      </div>
                  
                      <div style={timelineContent}>
                        <div style={historyBadges}>
                          {(call.Anliegen || "").split(",").map(item => item.trim()).filter(Boolean).sort((a, b) => a.localeCompare(b)).map((item, i) => (
                            <span key={i} style={{ ...badge,
                              background: item === "Termin" ? "#e0f2fe" : item === "Rezept" ? "#dcfce7" : item === "Attest" ? "#fef9c3" : "#e5e7eb",
                              color: item === "Termin" ? "#0369a1" : item === "Rezept" ? "#166534" : item === "Attest" ? "#854d0e" : "#374151",
                              border: item === "Termin" ? "1px solid #7dd3fc" : item === "Rezept" ? "1px solid #86efac" : item === "Attest" ? "1px solid #fde047" : "1px solid #d1d5db"
                            }}>
                              {item}
                            </span>
                          ))}
                        </div>
                  
                        <div style={historySummaryBox}>
                          <span style={detailLabel}>Zusammenfassung</span>
                          <p style={{ margin: 0 }}>{call.Zusammenfassung || "-"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
        
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
                <button
                  onClick={() => setConfirmAction("edit")}
                  style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", background: "white", cursor: "pointer", fontWeight: 400 }}
                >
                  Bearbeiten
                </button>
                
                <button
                  onClick={() => setConfirmAction("delete")}
                  style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontWeight: 400 }}
                >
                  Löschen
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmAction && selectedContact && (
          <div style={modalOverlay}>
            <div style={confirmModal}>
              <h3 style={{ marginTop: 0 }}>
                {confirmAction === "delete" ? "Kontakt löschen?" : "Kontakt bearbeiten?"}
              </h3>
        
              <p style={settingsText}>
                {confirmAction === "delete"
                  ? "Dieser Kontakt wird dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden."
                  : "Möchten Sie diesen Kontakt wirklich bearbeiten?"}
              </p>
        
              <div style={modalActions}>
                <button onClick={() => setConfirmAction(null)} style={cancelButton}>
                  Abbrechen
                </button>
        
                <button
                  style={confirmAction === "delete" ? deleteButton : addButton}
                  onClick={() => {
                    const manualIndex = manualContacts.findIndex(c =>
                      String(c.phone).replace(/\s/g, "") === String(selectedContact.phone).replace(/\s/g, "")
                    );
        
                    if (confirmAction === "edit") {
                      setEditingContactIndex(manualIndex);
                      setNewContactName(selectedContact.name);
                      setNewContactPhone(selectedContact.phone);
                      setNewContactBirthdate(selectedContact.birthdate);
                      setNewContactExisting(selectedContact.existing);
                      setNewContactDoctor(selectedContact.doctor);
                      setSelectedContact(null);
                      setShowAddContact(true);
                    }
        
                    if (confirmAction === "delete") {
                      const updated = manualContacts.filter(c =>
                        String(c.phone).replace(/\s/g, "") !== String(selectedContact.phone).replace(/\s/g, "")
                      );
                      setManualContacts(updated);
                      localStorage.setItem("manualContacts", JSON.stringify(updated));
                      setSelectedContact(null);
                    }
        
                    setConfirmAction(null);
                  }}
                >
                  {confirmAction === "delete" ? "Ja, löschen" : "Ja, bearbeiten"}
                </button>
              </div>
            </div>
          </div>
        )}
          
        <div style={{ ...toast, ...(showToast ? {} : toastHidden) }}>
          {toastMessage}
        </div>
          
      </main>
    </div>
  );
}


const layout = { display: "flex", height: "100vh", overflow: "hidden", background: "#f5f7fb", fontFamily: "Inter, sans-serif" };
const main = { flex: 1, padding: 32, overflow: "hidden", boxSizing: "border-box" };
const sidebar = { width: 190, flexShrink: 0, background: "#0f172a", color: "white", padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between" };
const navItem = { padding: 12, color: "#cbd5e1", cursor: "pointer", borderRadius: 10, transition: "all 0.2s ease" };
const activeNav = { padding: 12, background: "#2563eb", borderRadius: 10, color: "white", cursor: "pointer", transition: "all 0.2s ease" };
const cards = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, margin: "30px 0" };
const card = { background: "white", padding: 24, borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" };
const box = { background: "white", padding: 24, borderRadius: 16 };
const callCard = { padding: 16, border: "1px solid transparent", borderBottom: "1px solid #e5e7eb", cursor: "pointer", borderRadius: 14, transition: "all 0.2s ease", marginBottom: 8, background: "white" };
const callCardOpen = { ...callCard, background: "#f8fafc", boxShadow: "0 10px 28px rgba(15,23,42,0.08)", border: "1px solid #dbeafe" };
const callTop = { display: "grid", gridTemplateColumns: "90px 220px 360px 1fr 140px", gap: 12, alignItems: "center" };
const badge = { width: 90, minWidth: 90, height: 28, flexShrink: 0, display: "inline-flex", justifyContent: "center", alignItems: "center", borderRadius: 999, fontSize: 13, fontWeight: 500 };
const highlightCard = {  background: "linear-gradient(135deg, #2563eb, #1e40af)",  color: "white",  padding: 24,  borderRadius: 16,  boxShadow: "0 12px 30px rgba(37,99,235,0.30)"};
const headerRow = { display: "grid", gridTemplateColumns: "90px 220px 360px 1fr 140px", gap: 12, fontSize: 13, color: "#667085", marginBottom: 10, padding: "0 16px" };
const details = { marginTop: 16, padding: 16, background: "white", borderRadius: 14, border: "1px solid #e5e7eb", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 };
const detailCard = { background: "white", padding: 14, borderRadius: 12 };
const detailCardWide = { background: "#f8fafc", padding: 14, borderRadius: 12, gridColumn: "1 / -1" };
const detailLabel = { display: "block", color: "#64748b", fontSize: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 };
const selectStyle = { padding: "8px 10px", borderRadius: 10, border: "1px solid #d1d5db", background: "#f3f4f6", cursor: "pointer", fontWeight: 400 };
const deleteStyle = { color: "#dc2626", fontWeight: 600, cursor: "pointer" };
const bottomNav = { borderTop: "1px solid #334155", paddingTop: 16 };
const bottomItem = { padding: 12, color: "#94a3b8", background: "#1e293b", borderRadius: 10, marginBottom: 8, cursor: "pointer" };
const icon = { marginRight: 10, verticalAlign: "middle" };
const dateText = { fontSize: 12, color: "#94a3b8", marginTop: 2 };
const tabs = { display: "flex", gap: 20, marginBottom: 16 };
const tabItem = { border: "none", background: "transparent", padding: "9px 14px", borderRadius: 10, cursor: "pointer", color: "#64748b", fontWeight: 500 };
const tabBar = { display: "flex", gap: 8, background: "#eef2f7", padding: 6, borderRadius: 14, marginBottom: 18, width: "fit-content" };
const activeTab = { border: "none", background: "white", padding: "9px 14px", borderRadius: 10, cursor: "pointer", color: "#0f172a", fontWeight: 700, boxShadow: "0 4px 12px rgba(15,23,42,0.08)" };
const searchInput = { width: "25%", padding: "10px 12px", borderRadius: 10, border: "1px solid #dbe1ea" };
const filterRow = { display: "flex", gap: 10, marginBottom: 18, alignItems: "center" };
const datePicker = {  padding: "10px 12px",  borderRadius: 10,  border: "1px solid #dbe1ea",  cursor: "pointer",  width: 180};
const anliegenWrapper = { position: "relative", display: "flex", alignItems: "center" };
const filterIcon = { position: "absolute", left: 10, color: "#64748b" };
const filterSelect = { padding: "10px 12px 10px 32px", borderRadius: 10, border: "1px solid #dbe1ea", background: "white", cursor: "pointer" };
const filterActive = { padding: "10px 12px 10px 32px", borderRadius: 10, border: "1px solid #2563eb", background: "#eff6ff", cursor: "pointer", color: "#1d4ed8", fontWeight: 600 };
const quickDateButton = { padding: "10px 12px", borderRadius: 10, border: "1px solid #dbe1ea", background: "white", cursor: "pointer", fontSize: 13 };
const dateMenu = { position: "absolute", top: 48, right: 0, zIndex: 20, display: "flex", gap: 16, background: "white", padding: 12, borderRadius: 14, boxShadow: "0 12px 30px rgba(15,23,42,0.18)", border: "1px solid #e5e7eb" };
const dateShortcuts = { display: "flex", flexDirection: "column", gap: 8, minWidth: 140 };
const addButton = {  padding: "10px 14px",  borderRadius: 10,  border: "none",  background: "#2563eb",  color: "white",  cursor: "pointer",  fontWeight: 500};
const modalOverlay = { position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 };
const modal = { background: "white", padding: 24, borderRadius: 20, width: 560, display: "flex", flexDirection: "column", gap: 14, boxShadow: "0 24px 70px rgba(15,23,42,0.25)", animation: "fadeIn 0.2s ease" };
const modalHeader = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 };
const modalSubtext = { margin: "6px 0 0", color: "#667085", fontSize: 14 };
const closeButton = { border: "none", background: "#f1f5f9", width: 34, height: 34, borderRadius: 10, cursor: "pointer", fontSize: 20, color: "#334155", display: "flex", alignItems: "center", justifyContent: "center" };
const input = { width: "100%", padding: "10px 14px", borderRadius: 12, border: "1px solid #dbe1ea", background: "white", fontSize: 14, outline: "none", boxSizing: "border-box" };
const textarea = { ...input, height: 90, resize: "none", fontFamily: "Arial" };
const modalActions = { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 };
const cancelButton = { padding: "10px 14px", borderRadius: 10, border: "1px solid #d1d5db", background: "white", cursor: "pointer", fontWeight: 600 };
const formLabel = { display: "block", marginBottom: 6, color: "#475569", fontSize: 13, fontWeight: 400 };
const formSection = { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: 16 };
const sectionTitle = { margin: "0 0 12px", fontSize: 16, fontWeight: 800, color: "#0f172a", letterSpacing: 0.3 };
const formGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 };
const textareaFull = { ...input, width: "100%", height: 100, resize: "none", fontFamily: "Arial", boxSizing: "border-box" };
const checkOption = { display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 12, border: "1px solid #dbe1ea", background: "white", cursor: "pointer", fontSize: 14, color: "#334155" };
const settingsGrid = { display: "flex", flexDirection: "column", gap: 14, marginTop: 18 };
const settingsCard = { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: 18, gap: 24 };
const settingsCardColumn = { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: 18 };
const settingsTitle = { margin: 0, fontSize: 16, color: "#0f172a" };
const settingsText = { margin: "6px 0 0", color: "#64748b", fontSize: 14 };
const settingsActions = { display: "flex", justifyContent: "flex-end", marginTop: 24 };
const smallSaveButton = { padding: "10px 18px", borderRadius: 10, border: "none", background: "#2563eb", color: "white", cursor: "pointer", fontWeight: 700, width: "fit-content" };
const infoBox = { marginTop: 16, padding: 14, borderRadius: 12, background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8", fontSize: 14 };
const toggleSwitch = (active) => ({ width: 46, height: 24, borderRadius: 999, background: active ? "#22c55e" : "#e5e7eb", display: "flex", alignItems: "center", justifyContent: active ? "flex-end" : "flex-start", padding: 2, cursor: "pointer", transition: "all 0.2s ease" });
const toggleCircle = { width: 18, height: 18, borderRadius: "50%", background: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" };
const toast = { position: "fixed", right: 24, bottom: 24, background: "#dcfce7", color: "#166534", border: "1px solid #86efac", padding: "12px 18px", borderRadius: 12, boxShadow: "0 12px 30px rgba(15,23,42,0.18)", fontWeight: 400, fontSize: 13, zIndex: 100, minWidth: 260, textAlign: "left", transform: "translateY(0)", opacity: 1, transition: "all 0.5s ease" };
const toastHidden = { transform: "translateY(40px)", opacity: 0 };
const openingRow = { display: "grid", gridTemplateColumns: "120px 1fr 30px 1fr", gap: 10, alignItems: "center", marginTop: 10 };
const openingDay = { fontSize: 14, color: "#334155", fontWeight: 500 };
const settingsTwoColumn = { display: "grid", gridTemplateColumns: "260px 1fr", gap: 120, alignItems: "flex-start" };
const settingsDivider = { height: 1, background: "#e5e7eb", margin: "28px 0" };
const settingsFormGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 0 };
const openingRowDouble = { display: "grid", gridTemplateColumns: "120px 500px", gap: 18, alignItems: "start", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #e5e7eb" };
const membershipGrid = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 };
const membershipCard = { position: "relative", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 18, padding: 24, display: "flex", flexDirection: "column", minHeight: 520 };
const membershipCardActive = { position: "relative", background: "linear-gradient(135deg, #eff6ff, #ffffff)", border: "2px solid #2563eb", borderRadius: 18, padding: 24, boxShadow: "0 16px 40px rgba(37,99,235,0.18)", display: "flex", flexDirection: "column", minHeight: 520 };
const membershipIcon = { width: 54, height: 54, borderRadius: 16, background: "#e0edff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 };
const membershipTitle = { margin: 0, fontSize: 20, color: "#0f172a" };
const membershipPrice = { margin: "12px 0", fontSize: 30, color: "#0f172a" };
const membershipMonth = { fontSize: 14, color: "#64748b", fontWeight: 400 };
const membershipText = { color: "#475569", margin: "8px 0", fontSize: 14 };
const activePlanBadge = { marginTop: 18, padding: "9px 12px", borderRadius: 999, background: "#2563eb", color: "white", fontSize: 13, fontWeight: 700, width: "fit-content" };
const membershipDesc = { color: "#64748b", fontSize: 14, lineHeight: 1.5, minHeight: 44 };
const featureList = { marginTop: 18, display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 };
const featureItem = { margin: 0, fontSize: 14, color: "#334155" };
const planButton = { marginTop: "auto", paddingTop: 12, width: "100%", padding: "11px 14px", borderRadius: 12, border: "none", background: "#2563eb", color: "white", cursor: "pointer", fontWeight: 700 };
const disabledPlanButton = { marginTop: "auto", paddingTop: 12, width: "100%", padding: "11px 14px", borderRadius: 12, border: "1px solid #bfdbfe", background: "#eff6ff", color: "#2563eb", fontWeight: 700 };
const confirmModal = { background: "white", padding: 24, borderRadius: 18, width: 420, boxShadow: "0 24px 70px rgba(15,23,42,0.25)" };
const highlightInfo = { fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "6px 0" };
const planButtonWrap = { marginTop: "auto", paddingTop: 20 };
const smallSelect = { width: "110px", minWidth: "110px", maxWidth: "180px", flexShrink: 0, marginLeft: "auto", padding: "10px 14px", borderRadius: 12, border: "1px solid #dbe1ea", background: "#f8fafc", fontSize: 14, outline: "none", boxSizing: "border-box", textAlign: "center", textAlignLast: "center"};
const activeBottomItem = { padding: 12, color: "white", background: "#2563eb", borderRadius: 10, marginBottom: 8, cursor: "pointer" };
const profileGrid = { display: "flex", flexDirection: "column", gap: 16, width: "100%" };
const profileCard = { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, width: "100%", boxSizing: "border-box" };
const adminBadge = { display: "inline-block", marginTop: 8, padding: "7px 12px", borderRadius: 999, background: "#dcfce7", color: "#166534", fontWeight: 700, fontSize: 13 };
const profileBox = { background: "white", padding: 28, borderRadius: 18 };
const profileHeader = { display: "flex", alignItems: "center", gap: 16, marginBottom: 26 };
const profileAvatar = { width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #2563eb, #1e40af)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18 };
const loginHeader = { textAlign: "center", marginBottom: 22 };
const loginIcon = { width: 52, height: 52, borderRadius: 16, background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 24 };
const loginTitle = { margin: 0, fontSize: 26, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.3px" };
const loginText = { margin: "8px 0 0", color: "#64748b", fontSize: 14 };
const loginCard = { background: "white", padding: 30, borderRadius: 20, width: 320, boxShadow: "0 20px 50px rgba(15,23,42,0.08)" };
const loginLoader = { margin: "16px auto 0", width: 38, height: 38, borderRadius: "50%", border: "4px solid #dbeafe", borderTopColor: "#2563eb", animation: "spin 0.8s linear infinite" };
const contactHeaderRow = { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, fontSize: 13, color: "#667085", marginBottom: 10, padding: "0 16px" };
const contactRow = { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, padding: 16, borderBottom: "1px solid #e5e7eb", alignItems: "center" };
const unreadBadge = { position: "absolute", top: -7, right: -7, background: "#dc2626", color: "white", borderRadius: 999, minWidth: 20, height: 20, padding: "0 6px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(220,38,38,0.35)" };
const contactHistoryBox = { gridColumn: "1 / -1", marginTop: 14, padding: 16, background: "#f8fafc", border: "1px solid #dbeafe", borderRadius: 16, display: "flex", flexDirection: "column", gap: 14 };
const contactHistoryItem = { background: "white", border: "1px solid #e5e7eb", borderRadius: 14, padding: 16, boxShadow: "0 6px 16px rgba(15,23,42,0.04)", cursor: "pointer", display: "flex", flexDirection: "column", gap: 12 };
const historyTopRow = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, color: "#0f172a" };
const historyBadges = { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 };
const historySummaryBox = { background: "#f8fafc", borderRadius: 12, padding: 14 };
const patientSection = { border: "1px solid #e5e7eb", borderRadius: 16, padding: 16, marginTop: 10, background: "#f8fafc" };
const patientSectionTitle = { margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 };
const historySection = { border: "1px solid #dbeafe", borderRadius: 16, padding: 16, marginTop: 16, background: "#f8fafc" };
const historySectionTitle = { margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: 0.5 };
const patientDataGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 };
const sidebarUnreadBadge = { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "#dc2626", color: "white", borderRadius: 999, minWidth: 24, height: 24, padding: "0 7px", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(220,38,38,0.35)" };
const contactAddGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, alignItems: "end" };
const deleteButton = { padding: "10px 14px", borderRadius: 10, border: "none", background: "#dc2626", color: "white", cursor: "pointer", fontWeight: 500 };
const historyList = { display: "flex", flexDirection: "column", gap: 18, marginTop: 14 };
const timelineItem = { display: "grid", gridTemplateColumns: "120px 1fr", gap: 20, alignItems: "stretch" };
const timelineLeft = { position: "relative", borderRight: "2px solid #bfdbfe", paddingRight: 18, display: "flex", flexDirection: "column", alignItems: "flex-end" };
const timelineDot = { position: "absolute", right: -8, top: 6, width: 12, height: 12, borderRadius: "50%", background: "#2563eb", border: "2px solid white", boxShadow: "0 0 0 2px #bfdbfe" };
const timelineContent = { background: "white", border: "1px solid #e5e7eb", borderRadius: 14, padding: 16, boxShadow: "0 6px 16px rgba(15,23,42,0.04)" };
