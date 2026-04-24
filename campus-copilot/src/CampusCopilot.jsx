import { useState, useRef, useCallback, useEffect } from "react";

const TODAY = new Date().toISOString().split("T")[0];

// ─── EVENTS DATA ─────────────────────────────────────────────────────────────
const ALL_EVENTS = [
  { id:1,  title:"FAFSA Filing Workshop",                  dept:"Financial Aid Office",       school:"University-Wide", category:"Financial Aid", date:"2026-04-25", time:"2:00 PM",  location:"Student Union 210",       free:true, spots:30,  spotsLeft:12,  tags:["fafsa","aid","first-gen"],            desc:"Step-by-step help filing your FAFSA with a financial aid counselor present. Bring your FSA ID and tax documents.",                                       equity:true  },
  { id:2,  title:"Scholarship Fair",                       dept:"Dean of Students",           school:"University-Wide", category:"Financial Aid", date:"2026-04-28", time:"11:00 AM", location:"Main Quad",               free:true, spots:200, spotsLeft:200, tags:["scholarship","aid","money"],           desc:"50+ campus and external scholarships in one place. Bring your resume. Many awards specifically for first-gen and low-income students.",                   equity:true  },
  { id:3,  title:"Emergency Fund Info Session",            dept:"Financial Aid Office",       school:"University-Wide", category:"Financial Aid", date:"2026-04-30", time:"3:00 PM",  location:"Online (Zoom)",           free:true, spots:100, spotsLeft:73,  tags:["emergency","aid","housing"],           desc:"Learn how to apply for one-time emergency grants covering rent, food, medical bills, and transportation.",                                               equity:true  },
  { id:4,  title:"Financial Literacy: Budgeting 101",     dept:"Student Affairs",            school:"University-Wide", category:"Financial Aid", date:"2026-05-02", time:"4:00 PM",  location:"Library Room 3B",         free:true, spots:25,  spotsLeft:8,   tags:["budget","money","literacy"],           desc:"Practical budgeting for students on tight incomes. Learn to track spending, avoid debt, and stretch your aid package. Free snacks.",                    equity:true  },
  { id:5,  title:"Free Legal Clinic — Tenant Rights",     dept:"Student Legal Services",     school:"University-Wide", category:"Legal Aid",     date:"2026-04-25", time:"10:00 AM", location:"Law Building 101",        free:true, spots:20,  spotsLeft:5,   tags:["legal","housing","tenant"],           desc:"One-on-one consultations with law students supervised by licensed attorneys. Walk-ins welcome. Common topics: deposits, eviction, lease disputes.",       equity:true  },
  { id:6,  title:"Know Your Rights: Immigration",         dept:"International Student Svcs", school:"University-Wide", category:"Legal Aid",     date:"2026-04-29", time:"5:00 PM",  location:"International Center",   free:true, spots:50,  spotsLeft:31,  tags:["immigration","legal","rights","visa"], desc:"F-1, J-1, DACA, and undocumented student rights explained by an immigration attorney. What to do if contacted by ICE.",                               equity:true  },
  { id:7,  title:"Title IX Rights & Resources",           dept:"Office of Civil Rights",     school:"University-Wide", category:"Legal Aid",     date:"2026-05-01", time:"1:00 PM",  location:"Women's Center",          free:true, spots:40,  spotsLeft:22,  tags:["titleix","rights","legal","safety"],  desc:"What is Title IX, your protections, how to report — and how to do it confidentially. Advocates from the counseling center will be present.",             equity:true  },
  { id:8,  title:"Workplace Rights for Student Workers",  dept:"Student Employment Office",  school:"University-Wide", category:"Legal Aid",     date:"2026-05-05", time:"12:00 PM", location:"Career Center B2",        free:true, spots:35,  spotsLeft:19,  tags:["workplace","wages","legal","work"],   desc:"Wage theft, unsafe conditions, discrimination — know your rights as a student worker. Bring any pay stubs or contracts you have questions about.",        equity:true  },
  { id:9,  title:"Research Symposium",                    dept:"Graduate School",            school:"STEM",            category:"Academic",      date:"2026-04-26", time:"9:00 AM",  location:"Science Hall Auditorium", free:true, spots:300, spotsLeft:180, tags:["research","stem","grad"],             desc:"Undergraduate and graduate research presentations across all STEM disciplines. Poster session and keynote included.",                                    equity:false },
  { id:10, title:"Writing Center Open Lab",               dept:"English Department",         school:"Liberal Arts",    category:"Academic",      date:"2026-04-25", time:"10:00 AM", location:"Humanities 204",          free:true, spots:15,  spotsLeft:9,   tags:["writing","tutoring","academic"],       desc:"Drop in for help with papers, scholarship essays, cover letters, or any writing project. No appointment needed.",                                        equity:true  },
  { id:11, title:"First-Gen Student Study Hall",          dept:"First-Gen Center",           school:"University-Wide", category:"Academic",      date:"2026-04-27", time:"6:00 PM",  location:"First-Gen Center Lounge", free:true, spots:40,  spotsLeft:28,  tags:["first-gen","study","community"],       desc:"Dedicated quiet study space with peer tutors available in Math, Writing, and Sciences. Snacks and coffee provided.",                                     equity:true  },
  { id:12, title:"Peer Tutoring — Math Drop-In",          dept:"Math Department",            school:"STEM",            category:"Academic",      date:"2026-04-28", time:"3:00 PM",  location:"Math Building 110",       free:true, spots:20,  spotsLeft:14,  tags:["math","tutoring","stem"],             desc:"Free drop-in tutoring for Calculus, Statistics, and Linear Algebra. No appointment. Grad student tutors on hand.",                                      equity:true  },
  { id:13, title:"Resume Review: Non-Traditional Bkgnds", dept:"Career Center",             school:"University-Wide", category:"Career",        date:"2026-04-26", time:"2:00 PM",  location:"Career Center A1",        free:true, spots:15,  spotsLeft:6,   tags:["resume","career","non-traditional"],  desc:"Translate gig work, caregiving, military service, and community leadership into a polished professional resume.",                                        equity:true  },
  { id:14, title:"Mock Interview Practice",               dept:"Career Center",              school:"University-Wide", category:"Career",        date:"2026-04-30", time:"11:00 AM", location:"Career Center B1",        free:true, spots:20,  spotsLeft:11,  tags:["interview","career","internship"],     desc:"Practice behavioral interviews with industry volunteers. STAR method coaching. All majors welcome.",                                                     equity:false },
  { id:15, title:"Internship Info: International Students",dept:"Engineering School",        school:"STEM",            category:"Career",        date:"2026-05-02", time:"5:00 PM",  location:"Engineering Hall 200",    free:true, spots:60,  spotsLeft:40,  tags:["internship","career","engineering"],   desc:"How to find, apply for, and legally work internships on F-1 and J-1 visas — including OPT and CPT explained simply.",                                   equity:true  },
  { id:16, title:"Networking Dinner — First-Gen Alumni",  dept:"Alumni Office",              school:"University-Wide", category:"Career",        date:"2026-05-07", time:"6:30 PM",  location:"University Club",         free:true, spots:30,  spotsLeft:7,   tags:["networking","first-gen","career"],     desc:"Dinner with first-gen alumni in tech, policy, medicine, and finance. Fully funded. Dress business casual. Only 7 spots left.",                           equity:true  },
  { id:17, title:"Mental Health Drop-In Hours",           dept:"Counseling Center",          school:"University-Wide", category:"Wellness",      date:"2026-04-25", time:"1:00 PM",  location:"Counseling Center",       free:true, spots:10,  spotsLeft:4,   tags:["mental health","counseling","wellness"],desc:"No appointment needed. See a licensed counselor for up to 30 minutes. All students welcome regardless of insurance status.",                              equity:true  },
  { id:18, title:"Free Yoga — Stress Relief",             dept:"Recreation Center",          school:"University-Wide", category:"Wellness",      date:"2026-04-26", time:"7:00 AM",  location:"Rec Center Studio A",     free:true, spots:25,  spotsLeft:18,  tags:["yoga","wellness","stress","free"],     desc:"Free yoga every Saturday morning. Mats and towels provided. Beginner friendly — zero experience needed.",                                                equity:false },
  { id:19, title:"Food Pantry Open Hours",                dept:"Student Affairs",            school:"University-Wide", category:"Wellness",      date:"2026-04-25", time:"9:00 AM",  location:"Student Union B10",       free:true, spots:999, spotsLeft:999, tags:["food","pantry","free","emergency"],    desc:"Free groceries available to all enrolled students. No income verification or appointment needed. Bring your student ID. Open Mon–Fri.",                   equity:true  },
  { id:20, title:"Health Insurance Enrollment Help",      dept:"Student Health Center",      school:"University-Wide", category:"Wellness",      date:"2026-04-29", time:"2:00 PM",  location:"Health Center Lobby",     free:true, spots:20,  spotsLeft:12,  tags:["health","insurance","enrollment"],     desc:"Staff will walk you through your health insurance options, waiver process, and how to use your coverage. International students especially welcome.",     equity:true  },
  { id:21, title:"International Cultural Night",          dept:"International Center",       school:"University-Wide", category:"Community",     date:"2026-04-27", time:"7:00 PM",  location:"Student Union Ballroom",  free:true, spots:200, spotsLeft:120, tags:["international","culture","community"], desc:"Food, music, and performances from 30+ countries. Everyone welcome. One of the biggest student events of the semester.",                                 equity:false },
  { id:22, title:"First-Gen Peer Mentorship Kickoff",     dept:"First-Gen Center",           school:"University-Wide", category:"Community",     date:"2026-04-28", time:"5:00 PM",  location:"First-Gen Center",        free:true, spots:50,  spotsLeft:23,  tags:["first-gen","mentorship","community"],  desc:"Get matched with an upper-class first-gen student mentor. Applications accepted on the spot. Program runs through end of semester.",                     equity:true  },
  { id:23, title:"LGBTQ+ Campus Town Hall",               dept:"Diversity & Inclusion",      school:"University-Wide", category:"Community",     date:"2026-05-01", time:"6:00 PM",  location:"Pride Center",            free:true, spots:80,  spotsLeft:45,  tags:["lgbtq","community","inclusion"],       desc:"Open forum on campus policies, available resources, and community needs. Hosted by student leaders with admin present.",                                 equity:true  },
  { id:24, title:"Transfer Student Social",               dept:"Transfer Student Center",    school:"University-Wide", category:"Community",     date:"2026-05-03", time:"4:00 PM",  location:"Transfer Center Lounge",  free:true, spots:60,  spotsLeft:38,  tags:["transfer","social","community"],       desc:"Meet other transfer students, learn what resources exist specifically for you, and get connected with the transfer student network.",                    equity:true  },
];

const CATS = ["All","Financial Aid","Legal Aid","Academic","Career","Wellness","Community"];
const CAT_COL = { "Financial Aid":"#22c55e","Legal Aid":"#3b82f6","Academic":"#a855f7","Career":"#f59e0b","Wellness":"#06b6d4","Community":"#ec4899" };
const CAT_ICO = { "Financial Aid":"💰","Legal Aid":"⚖️","Academic":"📚","Career":"💼","Wellness":"❤️","Community":"🤝" };

// ─── TOOLS ───────────────────────────────────────────────────────────────────
const TOOLS = [
  { name:"add_expense",          description:"Add a new expense. Call IMMEDIATELY when user mentions spending money on ANYTHING.", input_schema:{ type:"object", properties:{ name:{type:"string"}, amount:{type:"number"}, category:{type:"string",enum:["Food","Transport","Entertainment","Shopping","Bills","Health","Education","Other"]}, date:{type:"string"} }, required:["name","amount","category"] } },
  { name:"get_spending_summary", description:"Get real-time spending summary. Call before answering ANY budget/spending question.", input_schema:{ type:"object", properties:{} } },
  { name:"get_all_transactions", description:"Get full transaction history for analysis or roasting.", input_schema:{ type:"object", properties:{} } },
  { name:"set_monthly_budget",   description:"Update the student's monthly budget.", input_schema:{ type:"object", properties:{ amount:{type:"number"} }, required:["amount"] } },
  { name:"delete_transaction",   description:"Remove a transaction by name match.", input_schema:{ type:"object", properties:{ transaction_name:{type:"string"} }, required:["transaction_name"] } },
  { name:"get_survival_context", description:"Get spending context for survival tips — cheap food, saving money, surviving the month.", input_schema:{ type:"object", properties:{} } },
  { name:"open_financial_aid_guide", description:"Open Financial Aid panel. Call when user asks about FAFSA, scholarships, Pell Grant, work-study, loans, emergency funds, appeals.", input_schema:{ type:"object", properties:{ topic:{type:"string",enum:["fafsa","scholarships","emergency","workstudy","appeals","overview"]} }, required:["topic"] } },
  { name:"open_legal_aid_guide",     description:"Open Legal Aid panel. Call when user mentions landlord, eviction, deposit, Title IX, harassment, workplace/wages, immigration, police, academic dismissal.", input_schema:{ type:"object", properties:{ situation:{type:"string",enum:["housing","academic","workplace","immigration","titleix","police"]} }, required:["situation"] } },
  { name:"open_events",              description:"Open Campus Events panel. Call when user asks about events, workshops, free food, things to do, what's happening, career fairs, tutoring, cultural events, free activities.", input_schema:{ type:"object", properties:{ category:{type:"string",enum:["All","Financial Aid","Legal Aid","Academic","Career","Wellness","Community"]}, search:{type:"string"} } } },
  { name:"rsvp_event",               description:"RSVP the student to an event by ID. Call when user wants to attend, sign up, or register for a specific event.", input_schema:{ type:"object", properties:{ event_id:{type:"number"} }, required:["event_id"] } },
];

const SYSTEM = `You are Campus Copilot — an AI equity tool for students, especially first-gen, low-income, and non-traditional students. FOUR superpowers:

1. BUDGET TRACKER — sarcastic, brutally honest. Gen Z energy. Roast with real data.
2. FINANCIAL AID NAVIGATOR — warm, plain-English. No jargon without explanation.
3. LEGAL AID GUIDE — calm, rights-focused. ALWAYS start: "I'm not a lawyer, but here's what you should generally know:"
4. CAMPUS EVENTS — find free workshops, legal clinics, food pantry, career fairs, community events across ALL schools and departments.

TOOL RULES (NON-NEGOTIABLE):
- Spending mentioned → add_expense IMMEDIATELY
- Budget question → get_spending_summary FIRST  
- "roast me" → get_all_transactions → roast with specific numbers
- Saving money / survival → get_survival_context
- FAFSA / scholarships / aid / emergency funds → open_financial_aid_guide
- Legal issues (landlord/Title IX/wages/visa/police/dismissal) → open_legal_aid_guide
- Events / workshops / free food / what's on campus / things to do → open_events with best category
- User wants to attend an event → rsvp_event

PROACTIVE EQUITY CROSS-LINKING: When relevant, mention events. User asks about FAFSA → mention the FAFSA Filing Workshop. User stressed about food → mention Food Pantry Open Hours (event 19). User asks about tenant rights → mention Free Legal Clinic (event 5).

Today: ${TODAY}. Currency: USD. Max 100 words except roasts/legal (150 max).`;

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const INIT_TXS = [
  { name:"Chipotle burrito bowl", amount:12.50, category:"Food",          date:"2026-04-20" },
  { name:"Uber to campus",        amount:8.75,  category:"Transport",      date:"2026-04-21" },
  { name:"Netflix",               amount:15.99, category:"Entertainment",  date:"2026-04-19" },
  { name:"Starbucks latte x3",    amount:19.35, category:"Food",           date:"2026-04-22" },
  { name:"Amazon textbook",       amount:47.00, category:"Education",      date:"2026-04-18" },
  { name:"Target snack haul",     amount:23.40, category:"Shopping",       date:"2026-04-21" },
  { name:"Gym membership",        amount:29.99, category:"Health",         date:"2026-04-01" },
  { name:"Uber to airport",       amount:24.50, category:"Transport",      date:"2026-04-17" },
];
const CAT_COLOR = { Food:"#22c55e",Transport:"#3b82f6",Entertainment:"#a855f7",Shopping:"#f59e0b",Bills:"#ef4444",Health:"#06b6d4",Education:"#f97316",Other:"#6b7280" };
const CAT_ICON  = { Food:"🍔",Transport:"🚗",Entertainment:"🎮",Shopping:"🛍️",Bills:"⚡",Health:"💊",Education:"📚",Other:"💰" };
const QUICK = ["Roast my spending 🔥","What events are on campus? 📅","My landlord won't return my deposit 🔑","What is FAFSA? 📋","Free food on campus? 🍎","Help me find scholarships 🎓"];

const AID_TOPICS = {
  overview:    { title:"Financial Aid 101",      color:"#22c55e", icon:"🎓", desc:"The complete map of money for college — all in plain English.", items:[{label:"FAFSA",sub:"Free Application for Federal Student Aid. Start here every year.",prompt:"Walk me through the FAFSA step by step"},{label:"Pell Grant",sub:"Free money from the government — does not need to be paid back.",prompt:"Do I qualify for a Pell Grant?"},{label:"Work-Study",sub:"Part-time campus job paid by federal aid.",prompt:"How does work-study work?"},{label:"Subsidized vs Unsubsidized Loans",sub:"The difference matters — by thousands of dollars.",prompt:"Explain subsidized vs unsubsidized loans"}] },
  fafsa:       { title:"FAFSA Deep Dive",        color:"#22c55e", icon:"📋", desc:"File FAFSA every year for federal aid. Free. Takes ~30 min.", items:[{label:"Gather these first",sub:"SSN, tax returns, bank statements, FSA ID",prompt:"What documents do I need to file FAFSA?"},{label:"File early",sub:"Opens Oct 1 — some aid is first-come-first-served.",prompt:"When should I file FAFSA?"},{label:"Verify if asked",sub:"If selected, reply within 2 weeks or lose aid.",prompt:"What is FAFSA verification?"},{label:"Appeal if needed",sub:"Lost a job? Medical bills? File a Professional Judgment Appeal.",prompt:"How do I file a financial aid appeal?"}] },
  scholarships:{ title:"Scholarship Playbook",   color:"#22c55e", icon:"🎯", desc:"Billions in scholarships go unclaimed every year. Apply anyway — always.", items:[{label:"First-gen scholarships",sub:"Many schools have exclusive funds for first-generation students.",prompt:"Find me first-generation scholarships"},{label:"Identity-based",sub:"By race, gender, heritage, religion, disability — all legit.",prompt:"What identity-based scholarships exist?"},{label:"Major-specific",sub:"Your department probably has scholarships no one applies for.",prompt:"How do I find major-specific scholarships?"},{label:"Essay shortcuts",sub:"Reuse one strong essay across 10+ applications.",prompt:"Help me write a scholarship essay"}] },
  emergency:   { title:"Emergency Funds",        color:"#ef4444", icon:"🆘", desc:"Can't make rent? Out of food? These exist — and you probably qualify.", items:[{label:"Campus emergency fund",sub:"Most schools have one. Dean of Students office.",prompt:"How do I apply for my school's emergency fund?"},{label:"Campus food pantry",sub:"Free groceries. Zero shame. Students use these every week.",prompt:"Where is the campus food pantry?"},{label:"SNAP benefits",sub:"Many college students qualify and don't know it.",prompt:"Do students qualify for SNAP food benefits?"},{label:"Emergency grants",sub:"One-time grants for rent, textbooks, medical, transport.",prompt:"How do I get an emergency grant?"}] },
  workstudy:   { title:"Work-Study Jobs",        color:"#22c55e", icon:"💼", desc:"Campus jobs where the school pays you using your aid package.", items:[{label:"You qualify if FAFSA said so",sub:"Check your award letter for Federal Work-Study.",prompt:"How do I know if I qualify for work-study?"},{label:"Jobs on campus portal",sub:"Library, admin, research, food service.",prompt:"Where do I find work-study jobs?"},{label:"Hours usually capped",sub:"10–20 hrs/week. Doesn't affect aid like regular income.",prompt:"How many work-study hours can I work?"},{label:"Apply early every semester",sub:"Good jobs fill up in the first 2 weeks.",prompt:"When should I apply for work-study?"}] },
  appeals:     { title:"Appeals & Special Cases",color:"#f59e0b", icon:"📝", desc:"Your circumstances changed? You can fight for more aid.", items:[{label:"Professional Judgment Appeal",sub:"Parent lost job, medical bills, divorce — school can adjust aid.",prompt:"How do I file a Professional Judgment Appeal?"},{label:"SAP appeal",sub:"Failed Satisfactory Academic Progress? Appeal within 14 days.",prompt:"How do I appeal a SAP suspension?"},{label:"Dependency override",sub:"Estranged from parents? You can file as independent.",prompt:"How do I get a dependency override?"},{label:"COA appeal",sub:"Computer for class? Medical needs? COA can be raised.",prompt:"Can I increase my Cost of Attendance?"}] },
};

const LEGAL_SITUATIONS = {
  housing:    { title:"Housing & Landlord",    color:"#3b82f6", icon:"🏠", desc:"Tenant rights are strong — landlords count on students not knowing them.",                rights:["Right to habitable conditions (heat, water, safety)","Right to security deposit return with itemized deductions","Right to proper eviction process — no lockouts or utility shutoffs","Right to 24hr notice before landlord entry (most states)"],          checklist:["Document everything with photos and timestamps","Send all complaints to landlord in writing","Review your lease for relevant clauses","Contact Campus Housing Office or Student Legal Services","Know your state's deposit return deadline (usually 14-30 days)"],                resources:[{name:"Student Legal Services",desc:"Free consultations for enrolled students",tag:"On campus"},{name:"Campus Housing Office",desc:"Lease disputes, habitability complaints",tag:"On campus"},{name:"Local Tenant Rights Hotline",desc:"Know your rights in your city and state",tag:"Community"}] },
  academic:   { title:"Academic Dispute",      color:"#a855f7", icon:"📚", desc:"Dismissal, grade disputes, and conduct hearings all have appeal processes.",               rights:["Right to written notice of decision and reasoning","Right to appeal within the stated window (usually 5-10 business days)","Right to review evidence against you before hearing","Right to an advisor or support person at hearings"],                        checklist:["Request the decision in writing with stated reasons","Note all appeal deadlines immediately","Gather supporting evidence (emails, assignments, medical records)","Contact the Campus Ombudsman for mediation","Consult Student Legal Services BEFORE any hearing"],                     resources:[{name:"Campus Ombudsman",desc:"Neutral mediator for academic disputes",tag:"On campus · Confidential"},{name:"Dean of Students Office",desc:"Student advocacy and hearing support",tag:"On campus"},{name:"Student Legal Services",desc:"Legal guidance for dismissal hearings",tag:"On campus"}] },
  workplace:  { title:"Workplace Issue",       color:"#f59e0b", icon:"💼", desc:"Student workers have the same wage laws as everyone else.",                                rights:["Right to minimum wage and overtime (federal and state)","Right to paid time worked — wage theft is illegal","Right to safe working conditions under OSHA","Right to freedom from workplace discrimination and harassment"],              checklist:["Document all hours worked with a personal log","Save all pay stubs and written communications","Contact the Student Employment Office first","File a wage claim with your state Labor Board","Consult Student Legal Services for serious issues"],                              resources:[{name:"Student Employment Office",desc:"Wage theft, work-study issues",tag:"On campus"},{name:"State Labor Board",desc:"File wage claims and complaints",tag:"Government"},{name:"Student Legal Services",desc:"Legal advice on employment rights",tag:"On campus"}] },
  immigration:{ title:"Immigration Status",    color:"#06b6d4", icon:"✈️", desc:"Your status matters. Get help before signing or speaking to authorities.",                rights:["Right to remain silent when questioned by ICE or officers","Right to not open your door without a judicial warrant","Right to refuse to sign anything without an attorney","Right to consult an immigration attorney"],                                checklist:["Do NOT sign any documents without legal counsel","Contact International Student Services immediately","Keep copies of all immigration documents safe","Know your DSO's emergency contact","Reach out to an immigration legal clinic for free help"],                     resources:[{name:"International Student Services",desc:"Visa, OPT/CPT, DACA, travel auth",tag:"On campus"},{name:"Immigration Legal Clinic",desc:"Free or low-cost immigration help",tag:"Community"},{name:"Student Legal Services",desc:"Referrals and general guidance",tag:"On campus"}] },
  titleix:    { title:"Title IX / Harassment", color:"#ec4899", icon:"🛡️", desc:"Strong federal protections exist — and reporting options are flexible.",                  rights:["Right to supportive measures without filing a formal complaint","Right to a Title IX investigation if you choose to file","Right to confidential counseling and medical care","Right to no retaliation for reporting"],                               checklist:["You don't have to decide whether to file right away","Seek medical attention if needed — evidence can be preserved","Contact the Title IX Coordinator to learn your options","Reach out to Campus Counseling for confidential support","Student Legal Services can explain the investigation process"],  resources:[{name:"Title IX Coordinator",desc:"Report harassment, assault, discrimination",tag:"On campus"},{name:"Campus Counseling Center",desc:"Confidential trauma-informed support",tag:"On campus · Confidential"},{name:"Student Legal Services",desc:"Rights in Title IX proceedings",tag:"On campus"}] },
  police:     { title:"Police Interaction",    color:"#ef4444", icon:"⚖️", desc:"Your rights during a police interaction are constitutional — use them.",                  rights:["Right to remain silent — you never have to answer questions","Right to refuse a search without a warrant","Right to an attorney before questioning","Right to leave if not detained (ask: 'Am I free to go?')"],                             checklist:["Say clearly: 'I am invoking my right to remain silent'","Do not consent to a search — even if asked nicely","Do not resist physically, even if you disagree","Contact Student Legal Services as soon as possible","Write down everything you remember while it's fresh"],                       resources:[{name:"Student Legal Services",desc:"URGENT: consult before speaking to authorities",tag:"On campus · Urgent"},{name:"Campus Ombudsman",desc:"If incident involved campus police",tag:"On campus"},{name:"Local Legal Aid Society",desc:"Free criminal defense help",tag:"Community"}] },
};

// ─── SURVIVE MODE DATA ────────────────────────────────────────────────────────
const RECIPES = [
  { name:"Egg Fried Rice",       cost:"$1.20", time:"10 min", emoji:"🍳", steps:"Leftover rice + 2 eggs + soy sauce + whatever veg. Fry on high heat. Done." },
  { name:"Peanut Butter Oats",   cost:"$0.60", time:"5 min",  emoji:"🥣", steps:"Oats + water + peanut butter + banana. Microwave 2 min. Surprisingly filling." },
  { name:"Black Bean Tacos",     cost:"$1.80", time:"8 min",  emoji:"🌮", steps:"Canned beans + tortilla + salsa + hot sauce. No cooking skill needed whatsoever." },
  { name:"Pasta Aglio e Olio",   cost:"$1.50", time:"15 min", emoji:"🍝", steps:"Pasta + garlic + olive oil + chili flakes. Italian poverty food that genuinely slaps." },
  { name:"Ramen Upgrade",        cost:"$0.90", time:"5 min",  emoji:"🍜", steps:"Instant ramen + egg + frozen veg + soy sauce. Turns a $0.25 packet into an actual meal." },
  { name:"Rice & Beans",         cost:"$0.80", time:"20 min", emoji:"🫘", steps:"Canned beans + rice + cumin + garlic powder. Complete protein. $0.80. Undefeated combo." },
];
const TRANSPORT = [
  { icon:"🚌", label:"City Bus",   save:"Save ~$8/trip vs Uber",  tip:"Google Maps → transit mode. Most campuses also have free shuttle routes worth knowing." },
  { icon:"🚶", label:"Walk It",    save:"Free. Always free.",      tip:"Under 20 min walk? That's a free $8 and bonus steps. Touch grass, save money." },
  { icon:"🚲", label:"Bike Share", save:"~$1–3/ride",             tip:"Lime or Bird dockless bikes. Way cheaper than Uber for anything under 2 miles." },
  { icon:"🤝", label:"Carpool",    save:"Split gas costs",         tip:"Post in your uni GroupMe or Discord. Someone is always going the same way." },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CampusCopilot() {
  const txRef     = useRef([...INIT_TXS]);
  const budgetRef = useRef(500);
  const msgsRef   = useRef([]);
  const bottomRef = useRef(null);

  const [txs,setTxs]                     = useState([...INIT_TXS]);
  const [budget,setBudget]               = useState(500);
  const [msgs,setMsgs]                   = useState([{ role:"assistant", content:"Hey! I'm Campus Copilot 🎓 — your all-in-one AI for money, financial aid, legal rights, and what's happening on campus. Just talk to me. What's good?" }]);
  const [input,setInput]                 = useState("");
  const [loading,setLoading]             = useState(false);
  const [toolMsg,setToolMsg]             = useState("");
  const [flash,setFlash]                 = useState(null);
  const [rightTab,setRightTab]           = useState("dashboard");
  const [activeAidTopic,setActiveAid]    = useState("overview");
  const [activeLegal,setActiveLegal]     = useState("housing");
  const [evCat,setEvCat]                 = useState("All");
  const [evSearch,setEvSearch]           = useState("");
  const [evView,setEvView]               = useState("all");
  const [rsvpd,setRsvpd]                 = useState(new Set());
  const [expanded,setExpanded]           = useState(null);
  const [budgetSubTab,setBudgetSubTab]   = useState("overview");
  const [location,setLocation]           = useState(null);
  const [locLoading,setLocLoading]       = useState(false);
  const [survivalTip,setSurvivalTip]     = useState("");
  const [survivalLoading,setSurvivalLoading] = useState(false);

  useEffect(() => { msgsRef.current = msgs; }, [msgs]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs,loading]);

  // budget derived
  const total      = txs.reduce((s,t)=>s+t.amount,0);
  const remaining  = budget-total;
  const pct        = Math.min((total/budget)*100,100);
  const byCat      = {};  txs.forEach(t=>{byCat[t.category]=(byCat[t.category]||0)+t.amount;});
  const sortedCats = Object.entries(byCat).sort((a,b)=>b[1]-a[1]);
  const maxAmt     = sortedCats[0]?.[1]||1;
  const isSurvival = pct>=65;
  const daysLeft   = new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate()-new Date().getDate();

  // events derived
  const filtered = ALL_EVENTS.filter(e=>{
    if (evView==="equity" && !e.equity) return false;
    if (evView==="rsvp"   && !rsvpd.has(e.id)) return false;
    if (evCat!=="All"  && e.category!==evCat) return false;
    if (evSearch) { const q=evSearch.toLowerCase(); return e.title.toLowerCase().includes(q)||e.tags.some(t=>t.includes(q))||e.dept.toLowerCase().includes(q)||e.desc.toLowerCase().includes(q); }
    return true;
  }).sort((a,b)=>a.date.localeCompare(b.date));

  const fmtDate   = d => new Date(d+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
  const daysUntil = d => { const diff=Math.round((new Date(d+"T12:00:00")-new Date())/(864e5)); return diff===0?"Today":diff===1?"Tomorrow":`In ${diff} days`; };

  const foodPct      = byCat["Food"]      ? (byCat["Food"]/budget)*100      : 0;
  const transportPct = byCat["Transport"] ? (byCat["Transport"]/budget)*100 : 0;
  const entPct       = byCat["Entertainment"] ? (byCat["Entertainment"]/budget)*100 : 0;

  const getLocation = () => {
    setLocLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => { setLocation({lat:pos.coords.latitude, lng:pos.coords.longitude}); setLocLoading(false); },
        () => { setLocation("denied"); setLocLoading(false); }
      );
    } else { setLocation("denied"); setLocLoading(false); }
  };

  const openMap = (query) => {
    const url = location && location!=="denied"
      ? `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${location.lat},${location.lng},14z`
      : `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    window.open(url, "_blank");
  };

  const generateSurvivalPlan = async () => {
    setSurvivalLoading(true); setSurvivalTip("");
    const ctx = {
      budget: budgetRef.current,
      spent: total,
      remaining,
      days_left: daysLeft,
      by_category: byCat,
      top_category: sortedCats[0]?.[0],
      transactions: txRef.current
    };
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:300,
          messages:[{role:"user",content:`Budget context: ${JSON.stringify(ctx)}. Give me a brutal, funny, SPECIFIC 3-point survival plan for the rest of the month. Reference actual transaction names. Be direct, Gen Z tone, under 120 words total. Format as 3 short punchy lines starting with 1. 2. 3.`}]
        })
      });
      const data = await res.json();
      setSurvivalTip(data.content?.[0]?.text || "Eat ramen. Take bus. Don't die.");
    } catch { setSurvivalTip("API hiccup. Survival tip: eat rice and cry."); }
    finally { setSurvivalLoading(false); }
  };

  // tool executor
  const execTool = useCallback((name,inp)=>{
    if (name==="add_expense") {
      const tx={name:inp.name,amount:+inp.amount,category:inp.category,date:inp.date||TODAY};
      txRef.current=[...txRef.current,tx]; setTxs([...txRef.current]);
      setFlash(inp.name); setTimeout(()=>setFlash(null),2500); setRightTab("dashboard");
      return {success:true,added:`${inp.name} $${inp.amount}`};
    }
    if (name==="get_spending_summary") {
      const t=txRef.current.reduce((s,t)=>s+t.amount,0); const by={};
      txRef.current.forEach(t=>{by[t.category]=+(((by[t.category]||0)+t.amount).toFixed(2));});
      return {budget:budgetRef.current,total_spent:+t.toFixed(2),remaining:+(budgetRef.current-t).toFixed(2),pct_used:+((t/budgetRef.current)*100).toFixed(1),by_category:by};
    }
    if (name==="get_all_transactions") return {transactions:txRef.current,count:txRef.current.length,total:+txRef.current.reduce((s,t)=>s+t.amount,0).toFixed(2)};
    if (name==="set_monthly_budget")   { budgetRef.current=+inp.amount; setBudget(+inp.amount); return {success:true,new_budget:inp.amount}; }
    if (name==="delete_transaction") {
      const q=inp.transaction_name.toLowerCase(); const i=txRef.current.findIndex(t=>t.name.toLowerCase().includes(q));
      if (i!==-1) { const removed=txRef.current[i].name; txRef.current=txRef.current.filter((_,j)=>j!==i); setTxs([...txRef.current]); return {success:true,removed}; }
      return {success:false};
    }
    if (name==="get_survival_context") {
      const t=txRef.current.reduce((s,t)=>s+t.amount,0); const by={};
      txRef.current.forEach(t=>{by[t.category]=+(((by[t.category]||0)+t.amount).toFixed(2));});
      const days=new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate()-new Date().getDate();
      return {budget:budgetRef.current,total_spent:+t.toFixed(2),remaining:+(budgetRef.current-t).toFixed(2),days_left_in_month:days,daily_budget_left:+((budgetRef.current-t)/Math.max(days,1)).toFixed(2),by_category:by,transactions:txRef.current};
    }
    if (name==="open_financial_aid_guide") { setRightTab("aid");    setActiveAid(inp.topic);      return {success:true,opened:inp.topic}; }
    if (name==="open_legal_aid_guide")     { setRightTab("legal");  setActiveLegal(inp.situation); return {success:true,opened:inp.situation}; }
    if (name==="open_events") {
      setRightTab("events"); if (inp.category) setEvCat(inp.category); if (inp.search) setEvSearch(inp.search);
      return {success:true,events_found:ALL_EVENTS.length,category_filter:inp.category||"All",sample:ALL_EVENTS.slice(0,4).map(e=>({id:e.id,title:e.title,date:e.date,free:e.free,equity:e.equity}))};
    }
    if (name==="rsvp_event") {
      const ev=ALL_EVENTS.find(e=>e.id===inp.event_id);
      if (ev) { setRsvpd(prev=>new Set([...prev,inp.event_id])); setRightTab("events"); return {success:true,event:ev.title,date:ev.date,time:ev.time,location:ev.location}; }
      return {success:false,error:"Event not found"};
    }
    return {error:"Unknown tool"};
  },[]);

  // send
  const send = useCallback(async (txt)=>{
    const text=txt||input.trim(); if (!text||loading) return;
    setInput(""); setLoading(true);
    const cur=[...msgsRef.current,{role:"user",content:text}]; setMsgs(cur);
    try {
      let chain=cur.map(m=>({role:m.role,content:m.content})); let final="";
      for (let i=0;i<6;i++) {
        const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:SYSTEM,tools:TOOLS,messages:chain})});
        const data=await res.json();
        if (data.stop_reason==="tool_use") {
          const results=[];
          for (const blk of data.content.filter(b=>b.type==="tool_use")) {
            setToolMsg(`⚡ ${blk.name.replace(/_/g," ")}…`);
            await new Promise(r=>setTimeout(r,220));
            results.push({type:"tool_result",tool_use_id:blk.id,content:JSON.stringify(execTool(blk.name,blk.input))});
          }
          setToolMsg(""); chain=[...chain,{role:"assistant",content:data.content},{role:"user",content:results}];
        } else { final=data.content?.find(b=>b.type==="text")?.text||"Done."; break; }
      }
      setMsgs(prev=>[...prev,{role:"assistant",content:final}]);
    } catch(e) { setMsgs(prev=>[...prev,{role:"assistant",content:`Error: ${e.message}`}]); }
    finally { setLoading(false); setToolMsg(""); }
  },[input,loading,execTool]);

  const aidTopic = AID_TOPICS[activeAidTopic];
  const legalSit = LEGAL_SITUATIONS[activeLegal];

  // ─ render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"#080808",color:"#e5e7eb",fontFamily:"'Outfit','Segoe UI',sans-serif",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#111}::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:2px}
        .msg{animation:su .28s ease}
        .ql:hover:not(:disabled){background:rgba(34,197,94,.08)!important;border-color:#22c55e!important;color:#22c55e!important}
        .sb:hover:not(:disabled){background:#16a34a!important}.sb:disabled{opacity:.4;cursor:not-allowed}.ql:disabled{opacity:.5;cursor:not-allowed}
        @keyframes su{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fl{0%{background:rgba(34,197,94,.18)}100%{background:transparent}}.fl{animation:fl 2s ease}
        @keyframes p{0%,100%{opacity:1}50%{opacity:.3}}.p1{animation:p 1.2s .0s infinite}.p2{animation:p 1.2s .2s infinite}.p3{animation:p 1.2s .4s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        @keyframes sIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        input:focus{outline:none!important}
        .pbar{transition:width .6s ease,background .3s}.cbar{transition:width .5s ease}
        .rtab{cursor:pointer;transition:all .2s;padding:7px 13px;border-radius:8px;font-size:12px;font-weight:600;letter-spacing:.04em;border:none;font-family:'Outfit',sans-serif}
        .rtab:hover{background:#161616!important}
        .tbtn{transition:all .2s;cursor:pointer}.tbtn:hover{border-color:#333!important;background:#141414!important}
        .rc{transition:all .2s}.rc:hover{border-color:#333!important;transform:translateY(-1px)}
        .ck{transition:all .2s;cursor:pointer}.ck:hover{background:#141414!important}
        .ab{transition:all .2s;cursor:pointer}.ab:hover{transform:translateY(-1px);filter:brightness(1.15)}
        .evc{transition:all .2s;cursor:pointer}.evc:hover{border-color:#333!important;background:#0f0f0f!important}
        .fb{transition:all .2s;cursor:pointer;border:none;font-family:'Outfit',sans-serif}.fb:hover{opacity:.82}
        .rb{transition:all .2s;cursor:pointer;border:none;font-family:'Outfit',sans-serif}.rb:hover:not(:disabled){filter:brightness(1.1);transform:translateY(-1px)}
        .vt{cursor:pointer;transition:all .2s;border:none;font-family:'Outfit',sans-serif;border-radius:6px;padding:5px 11px;font-size:11px;font-weight:600}.vt:hover{opacity:.82}
      `}</style>

      {/* HEADER */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 20px",borderBottom:"1px solid #161616",background:"#0c0c0c",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20}}>🎓</span>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:17,fontWeight:700,color:"#fff",letterSpacing:"-0.5px"}}>Campus Copilot</span>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,fontWeight:700,background:"#22c55e",color:"#000",padding:"2px 7px",borderRadius:4}}>AI</span>
          {isSurvival&&<span style={{fontFamily:"'Space Mono',monospace",fontSize:10,fontWeight:700,background:"#ef444420",color:"#ef4444",padding:"2px 7px",borderRadius:4,border:"1px solid #ef444430",animation:"pulse 2s infinite"}}>⚠ SURVIVAL MODE</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 8px #22c55e66"}}/>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#4b5563"}}>CLAUDE SONNET · 10 TOOLS + LIVE MAPS</span>
        </div>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>

        {/* LEFT: CHAT */}
        <div style={{width:"38%",display:"flex",flexDirection:"column",borderRight:"1px solid #161616",background:"#0c0c0c"}}>
          <div style={{flex:1,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
            {msgs.map((m,i)=>(
              <div key={i} className="msg" style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:7}}>
                {m.role==="assistant"&&<div style={{width:26,height:26,borderRadius:"50%",background:"#1a1a1a",border:"1px solid #2a2a2a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>🎓</div>}
                <div style={{maxWidth:"78%",padding:"9px 13px",borderRadius:14,fontSize:13.5,lineHeight:1.55,...(m.role==="user"?{background:"#22c55e",color:"#000",fontWeight:500,borderBottomRightRadius:3}:{background:"#141414",color:"#d1d5db",border:"1px solid #1f1f1f",borderBottomLeftRadius:3})}}>
                  {m.content}
                </div>
              </div>
            ))}
            {(loading||toolMsg)&&(
              <div className="msg" style={{display:"flex",alignItems:"flex-end",gap:7}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:"#1a1a1a",border:"1px solid #2a2a2a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>🎓</div>
                <div style={{background:"#141414",border:"1px solid #1f1f1f",borderRadius:14,borderBottomLeftRadius:3,padding:"10px 14px"}}>
                  {toolMsg?<span style={{fontFamily:"'Space Mono',monospace",fontSize:12,color:"#22c55e"}}>{toolMsg}</span>
                          :<div style={{display:"flex",gap:4}}><span className="p1" style={{color:"#22c55e",fontSize:10}}>●</span><span className="p2" style={{color:"#22c55e",fontSize:10}}>●</span><span className="p3" style={{color:"#22c55e",fontSize:10}}>●</span></div>}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,padding:"8px 14px"}}>
            {QUICK.map(q=>(
              <button key={q} className="ql" onClick={()=>send(q)} disabled={loading}
                style={{background:"transparent",border:"1px solid #222",borderRadius:18,color:"#6b7280",padding:"5px 11px",fontSize:12,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .2s"}}>
                {q}
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:8,padding:"10px 14px",borderTop:"1px solid #161616"}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} disabled={loading}
              placeholder="Money, aid, rights, events — just ask…"
              style={{flex:1,background:"#141414",border:"1px solid #222",borderRadius:10,color:"#e5e7eb",padding:"9px 13px",fontSize:13.5,fontFamily:"'Outfit',sans-serif"}}/>
            <button className="sb" onClick={()=>send()} disabled={loading||!input.trim()}
              style={{width:38,height:38,borderRadius:9,background:"#22c55e",border:"none",color:"#000",fontSize:18,cursor:"pointer",fontWeight:700,flexShrink:0}}>↑</button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{flex:1,display:"flex",flexDirection:"column",background:"#080808",overflow:"hidden"}}>

          {/* TAB BAR */}
          <div style={{display:"flex",gap:4,padding:"10px 14px",borderBottom:"1px solid #161616",flexShrink:0,background:"#0c0c0c",overflowX:"auto"}}>
            <button className="rtab" onClick={()=>setRightTab("dashboard")} style={{background:rightTab==="dashboard"?"#161616":"transparent",color:rightTab==="dashboard"?"#22c55e":"#6b7280"}}>💰 Budget</button>
            <button className="rtab" onClick={()=>setRightTab("around")} style={{background:rightTab==="around"?"#0a0f1f":"transparent",color:rightTab==="around"?"#3b82f6":"#6b7280",border:rightTab==="around"?"1px solid #3b82f622":"none"}}>🚌 Get Around</button>
            <button className="rtab" onClick={()=>setRightTab("aid")}       style={{background:rightTab==="aid"?"#0f1f0f":"transparent",color:rightTab==="aid"?"#22c55e":"#6b7280",border:rightTab==="aid"?"1px solid #22c55e22":"none"}}>🎓 Financial Aid</button>
            <button className="rtab" onClick={()=>setRightTab("legal")}     style={{background:rightTab==="legal"?"#0a0f1f":"transparent",color:rightTab==="legal"?"#3b82f6":"#6b7280",border:rightTab==="legal"?"1px solid #3b82f622":"none"}}>⚖️ Legal Aid</button>
            <button className="rtab" onClick={()=>setRightTab("events")}    style={{background:rightTab==="events"?"#150e1f":"transparent",color:rightTab==="events"?"#a855f7":"#6b7280",border:rightTab==="events"?"1px solid #a855f722":"none",position:"relative"}}>
              📅 Events
              {rsvpd.size>0&&<span style={{position:"absolute",top:3,right:3,width:7,height:7,background:"#a855f7",borderRadius:"50%"}}/>}
            </button>
          </div>

          {/* BUDGET */}
          {rightTab==="dashboard"&&(
            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

              {/* Sub-tab switcher */}
              <div style={{display:"flex",gap:6,padding:"10px 14px 0",flexShrink:0}}>
                <button className="vt" onClick={()=>setBudgetSubTab("overview")} style={{background:budgetSubTab==="overview"?"#161616":"transparent",color:budgetSubTab==="overview"?"#22c55e":"#6b7280",border:`1px solid ${budgetSubTab==="overview"?"#22c55e33":"#222"}`}}>📊 Overview</button>
                <button className="vt" onClick={()=>setBudgetSubTab("survive")} style={{background:budgetSubTab==="survive"?(isSurvival?"#200a0a":"#161616"):"transparent",color:budgetSubTab==="survive"?(isSurvival?"#ef4444":"#a855f7"):"#6b7280",border:`1px solid ${budgetSubTab==="survive"?(isSurvival?"#ef444433":"#a855f733"):"#222"}`,position:"relative"}}>
                  🆘 Survive Mode {isSurvival&&<span style={{marginLeft:4,color:"#ef4444"}}>⚡</span>}
                </button>
              </div>

              {budgetSubTab==="overview"&&(
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:10,padding:14,overflowY:"auto"}}>
                <div style={{background:"#0e0e0e",border:"1px solid #181818",borderRadius:14,padding:"16px 18px",flexShrink:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <span style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em"}}>Monthly Budget</span>
                  <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#374151"}}>{new Date().toLocaleString("default",{month:"long",year:"numeric"})}</span>
                </div>
                <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:14}}>
                  <div><div style={{fontFamily:"'Space Mono',monospace",fontSize:30,fontWeight:700,color:"#fff",lineHeight:1}}>${total.toFixed(2)}</div><div style={{fontSize:11,color:"#6b7280",marginTop:3}}>spent</div></div>
                  <div style={{fontSize:22,color:"#222",margin:"0 4px"}}>/</div>
                  <div><div style={{fontFamily:"'Space Mono',monospace",fontSize:20,color:"#374151",lineHeight:1}}>${budget.toFixed(0)}</div><div style={{fontSize:11,color:"#6b7280",marginTop:3}}>budget</div></div>
                  <div style={{marginLeft:"auto",textAlign:"right"}}>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:22,fontWeight:700,color:remaining<0?"#ef4444":"#22c55e",lineHeight:1}}>{remaining<0?"-":""}${Math.abs(remaining).toFixed(2)}</div>
                    <div style={{fontSize:11,color:"#6b7280",marginTop:3}}>{remaining<0?"over budget":"remaining"}</div>
                  </div>
                </div>
                <div style={{height:5,background:"#1a1a1a",borderRadius:4,overflow:"hidden",marginBottom:5}}>
                  <div className="pbar" style={{height:"100%",borderRadius:4,width:`${pct}%`,background:pct>90?"#ef4444":pct>70?"#f59e0b":"#22c55e"}}/>
                </div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"#374151",textAlign:"right"}}>{pct.toFixed(1)}% used · {daysLeft} days left</div>
              </div>
              {isSurvival&&(
                <div className="ab" onClick={()=>{setRightTab("aid");setActiveAid("emergency");}} style={{background:"#1a0a0a",border:"1px solid #ef444430",borderRadius:12,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><div style={{fontSize:12,fontWeight:600,color:"#ef4444",marginBottom:2}}>⚠️ You're burning through your budget</div><div style={{fontSize:11,color:"#9ca3af"}}>Tap → campus emergency funds</div></div>
                  <span style={{color:"#ef4444",fontSize:18}}>→</span>
                </div>
              )}
              <div style={{background:"#0e0e0e",border:"1px solid #181818",borderRadius:14,padding:"16px 18px",flexShrink:0}}>
                <div style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:14}}>Spending Breakdown</div>
                <div style={{display:"flex",flexDirection:"column",gap:9}}>
                  {sortedCats.map(([cat,amt])=>(
                    <div key={cat} style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,width:95,flexShrink:0}}><span style={{fontSize:14}}>{CAT_ICON[cat]||"💰"}</span><span style={{fontSize:12,color:"#9ca3af",fontWeight:500}}>{cat}</span></div>
                      <div style={{flex:1,height:5,background:"#1a1a1a",borderRadius:4,overflow:"hidden"}}><div className="cbar" style={{height:"100%",borderRadius:4,width:`${(amt/maxAmt)*100}%`,background:CAT_COLOR[cat]||"#6b7280"}}/></div>
                      <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#6b7280",width:44,textAlign:"right",flexShrink:0}}>${amt.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:"#0e0e0e",border:"1px solid #181818",borderRadius:14,padding:"16px 18px",flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <span style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em"}}>Transactions</span>
                  <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#374151"}}>{txs.length} items</span>
                </div>
                <div style={{overflowY:"auto",display:"flex",flexDirection:"column",gap:5}}>
                  {[...txs].reverse().map((tx,i)=>(
                    <div key={i} className={flash===tx.name?"fl":""} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 8px",borderRadius:8}}>
                      <span style={{fontSize:15,flexShrink:0}}>{CAT_ICON[tx.category]||"💰"}</span>
                      <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,color:"#e5e7eb",fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{tx.name}</div><div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"#374151",marginTop:1}}>{tx.date}</div></div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,flexShrink:0}}>
                        <span style={{fontFamily:"'Space Mono',monospace",fontSize:13,color:"#fff",fontWeight:700}}>-${tx.amount.toFixed(2)}</span>
                        <span style={{fontSize:10,padding:"2px 7px",borderRadius:4,fontWeight:600,background:(CAT_COLOR[tx.category]||"#6b7280")+"22",color:CAT_COLOR[tx.category]||"#6b7280"}}>{tx.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </div>
              )}

              {budgetSubTab==="survive"&&(
              <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:12}}>

                {/* Status banner */}
                <div style={{background:isSurvival?"#1a0a0a":"#0a1a0a",border:`1px solid ${isSurvival?"#ef444430":"#22c55e30"}`,borderRadius:14,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:isSurvival?"#ef4444":"#22c55e",marginBottom:4}}>{isSurvival?"⚠️ You're burning through your budget":"✅ You're doing okay-ish"}</div>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#6b7280"}}>${remaining.toFixed(2)} left · {daysLeft} days remaining · ${(remaining/Math.max(daysLeft,1)).toFixed(2)}/day</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:26,fontWeight:700,color:isSurvival?"#ef4444":"#22c55e"}}>{pct.toFixed(0)}%</div>
                    <div style={{fontSize:10,color:"#6b7280"}}>used</div>
                  </div>
                </div>

                {/* AI Survival Plan */}
                <div style={{background:"#0e0e0e",border:"1px solid #1e1230",borderRadius:14,padding:"16px 18px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#a855f7",textTransform:"uppercase",letterSpacing:"0.07em"}}>🤖 AI Survival Plan</div>
                    <button className="ab" onClick={generateSurvivalPlan} disabled={survivalLoading}
                      style={{background:"#6d28d9",border:"none",borderRadius:8,color:"#fff",padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",opacity:survivalLoading?0.6:1}}>
                      {survivalLoading?"Thinking…":survivalTip?"Regenerate ↺":"Generate Plan ✦"}
                    </button>
                  </div>
                  {survivalLoading&&(
                    <div style={{display:"flex",gap:4,padding:"8px 0"}}>
                      <span className="p1" style={{color:"#a855f7",fontSize:10}}>●</span><span className="p2" style={{color:"#a855f7",fontSize:10}}>●</span><span className="p3" style={{color:"#a855f7",fontSize:10}}>●</span>
                    </div>
                  )}
                  {survivalTip&&!survivalLoading&&(
                    <div style={{fontSize:13,color:"#c4b5fd",lineHeight:1.7,animation:"sIn .3s ease"}}>
                      {survivalTip.split("\n").map((line,i)=>line.trim()&&<div key={i} style={{marginBottom:6}}>{line}</div>)}
                    </div>
                  )}
                  {!survivalTip&&!survivalLoading&&(
                    <div style={{fontSize:12,color:"#374151",fontStyle:"italic"}}>Hit "Generate Plan" — Claude will roast your spending and tell you exactly how to survive the next {daysLeft} days.</div>
                  )}
                </div>

                {/* Food section - Budget Bites */}
                <div style={{background:"#0e0e0e",border:`1px solid ${foodPct>15?"#22c55e30":"#181818"}`,borderRadius:14,padding:"16px 18px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div>
                      <div style={{fontSize:11,fontWeight:600,color:"#22c55e",textTransform:"uppercase",letterSpacing:"0.07em"}}>🍔 Budget Bites</div>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"#6b7280",marginTop:3}}>
                        Food spend: ${(byCat["Food"]||0).toFixed(0)} ({foodPct.toFixed(0)}% of budget)
                        {foodPct>15&&<span style={{color:"#f59e0b"}}> · 🔥 HIGH</span>}
                      </div>
                    </div>
                  </div>

                  {/* Map buttons */}
                  <div style={{display:"flex",gap:8,marginBottom:14}}>
                    <button className="ab" onClick={()=>openMap("cheap restaurants near me under $10")}
                      style={{flex:1,background:"#1e3a8a",border:"1px solid #1d4ed844",borderRadius:9,color:"#93c5fd",padding:"9px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                      <span style={{fontSize:14}}>🗺️</span> Cheap Restaurants Near Me
                    </button>
                    <button className="ab" onClick={()=>openMap("grocery store near me")}
                      style={{flex:1,background:"#14532d",border:"1px solid #16a34a44",borderRadius:9,color:"#86efac",padding:"9px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                      <span style={{fontSize:14}}>🛒</span> Grocery Store Near Me
                    </button>
                  </div>

                  {/* Location bar */}
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,padding:"7px 10px",background:"#141414",borderRadius:8,border:"1px solid #1e1e1e"}}>
                    <span style={{fontSize:13}}>📍</span>
                    <span style={{fontSize:12,color:"#6b7280",flex:1}}>
                      {locLoading?"Getting location…":location&&location!=="denied"?"Location active — maps open near you":location==="denied"?"Location denied — maps open general search":"Enable location for hyper-local results"}
                    </span>
                    {!location&&(
                      <button className="ab" onClick={getLocation} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:6,color:"#22c55e",padding:"4px 10px",fontSize:11,fontWeight:600,fontFamily:"'Outfit',sans-serif",cursor:"pointer"}}>
                        {locLoading?"…":"Use My Location"}
                      </button>
                    )}
                    {location&&location!=="denied"&&<span style={{fontSize:11,color:"#22c55e"}}>✓ Active</span>}
                  </div>

                  {/* Recipe cards */}
                  <div style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Cook This Instead (Broke Student Edition)</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {RECIPES.map(r=>(
                      <div key={r.name} style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:10,padding:"11px 13px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                          <span style={{fontSize:20}}>{r.emoji}</span>
                          <div>
                            <div style={{fontSize:12,fontWeight:600,color:"#e5e7eb"}}>{r.name}</div>
                            <div style={{display:"flex",gap:8,marginTop:2}}>
                              <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"#22c55e"}}>{r.cost}</span>
                              <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"#6b7280"}}>{r.time}</span>
                            </div>
                          </div>
                        </div>
                        <div style={{fontSize:11,color:"#9ca3af",lineHeight:1.5}}>{r.steps}</div>
                      </div>
                    ))}
                    <div className="ab" onClick={()=>send("Give me 3 more cheap meal ideas under $2 each")}
                      style={{background:"#111",border:"1px dashed #22c55e30",borderRadius:10,padding:"11px 13px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontSize:20,marginBottom:4}}>✨</div>
                        <div style={{fontSize:11,color:"#22c55e",fontWeight:600}}>Ask AI for more recipes ↗</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Entertainment reality check */}
                {entPct>4&&(
                  <div style={{background:"#1a0a0a",border:"1px solid #ef444425",borderRadius:14,padding:"14px 18px"}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#ef4444",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>🎮 Entertainment Reality Check</div>
                    <div style={{fontSize:13,color:"#fca5a5",lineHeight:1.7}}>
                      You've spent <span style={{fontFamily:"'Space Mono',monospace",fontWeight:700}}>${(byCat["Entertainment"]||0).toFixed(2)}</span> on entertainment this month.
                      That's {Math.round((byCat["Entertainment"]||0)/1.2)} cups of coffee or {Math.round((byCat["Entertainment"]||0)/2)} cheap meals.
                      Your university probably has <strong style={{color:"#fca5a5"}}>free events, free streaming, and a free gym</strong>. Use them.
                    </div>
                  </div>
                )}

                {/* Cross-link to food pantry event */}
                {isSurvival&&(
                  <div className="ab" onClick={()=>{setRightTab("events");setEvCat("Wellness");setEvSearch("food");}}
                    style={{background:"#0f1f0f",border:"1px solid #22c55e30",borderRadius:12,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:12,fontWeight:600,color:"#22c55e",marginBottom:2}}>🍎 Campus Food Pantry open today</div>
                      <div style={{fontSize:11,color:"#9ca3af"}}>Free groceries. No income check. Tap to see hours →</div>
                    </div>
                    <span style={{color:"#22c55e",fontSize:18}}>→</span>
                  </div>
                )}

              </div>
              )}

            </div>
          )}

          {/* GET AROUND */}
          {rightTab==="around"&&(
            <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:12}}>

              {/* Hero / transport spend */}
              <div style={{background:"#0e0e0e",border:`1px solid ${transportPct>8?"#3b82f630":"#181818"}`,borderRadius:14,padding:"16px 18px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:11,fontWeight:600,color:"#3b82f6",textTransform:"uppercase",letterSpacing:"0.07em"}}>🚌 Get Around for Less</div>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#6b7280",marginTop:4}}>
                      Transport spend: ${(byCat["Transport"]||0).toFixed(0)} ({transportPct.toFixed(0)}% of budget)
                      {transportPct>8&&<span style={{color:"#f59e0b"}}> · 🔥 HIGH</span>}
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:22,fontWeight:700,color:"#3b82f6"}}>${(byCat["Transport"]||0).toFixed(0)}</div>
                    <div style={{fontSize:10,color:"#6b7280"}}>this month</div>
                  </div>
                </div>
              </div>

              {/* Location bar */}
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 13px",background:"#0e0e0e",borderRadius:10,border:"1px solid #181818"}}>
                <span style={{fontSize:15}}>📍</span>
                <span style={{fontSize:12,color:"#9ca3af",flex:1}}>
                  {locLoading?"Getting location…":location&&location!=="denied"?"Location active — all maps open near you":location==="denied"?"Location denied — maps open general search":"Enable location for hyper-local results"}
                </span>
                {!location&&(
                  <button className="ab" onClick={getLocation} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:6,color:"#3b82f6",padding:"4px 10px",fontSize:11,fontWeight:600,fontFamily:"'Outfit',sans-serif",cursor:"pointer"}}>
                    {locLoading?"…":"Use My Location"}
                  </button>
                )}
                {location&&location!=="denied"&&<span style={{fontSize:11,color:"#22c55e",fontWeight:600}}>✓ Active</span>}
              </div>

              {/* Primary map buttons — grid of 4 */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <button className="ab" onClick={()=>openMap("bus stop near me")}
                  style={{background:"#1e3a8a",border:"1px solid #1d4ed844",borderRadius:10,color:"#93c5fd",padding:"14px 12px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                  <span style={{fontSize:24}}>🚌</span> Find Bus Stops
                  <span style={{fontSize:10,color:"#93c5fdaa",fontWeight:400}}>Public transit routes</span>
                </button>
                <button className="ab" onClick={()=>openMap("university shuttle stop near me")}
                  style={{background:"#581c87",border:"1px solid #a855f744",borderRadius:10,color:"#d8b4fe",padding:"14px 12px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                  <span style={{fontSize:24}}>🚐</span> Campus Shuttles
                  <span style={{fontSize:10,color:"#d8b4feaa",fontWeight:400}}>Usually free for students</span>
                </button>
                <button className="ab" onClick={()=>openMap("bike share station near me")}
                  style={{background:"#14532d",border:"1px solid #16a34a44",borderRadius:10,color:"#86efac",padding:"14px 12px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                  <span style={{fontSize:24}}>🚲</span> Bike Share
                  <span style={{fontSize:10,color:"#86efacaa",fontWeight:400}}>Lime, Bird, Citi Bike</span>
                </button>
                <button className="ab" onClick={()=>openMap("scooter rental near me")}
                  style={{background:"#7c2d12",border:"1px solid #f9731644",borderRadius:10,color:"#fdba74",padding:"14px 12px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                  <span style={{fontSize:24}}>🛴</span> E-Scooters
                  <span style={{fontSize:10,color:"#fdba74aa",fontWeight:400}}>Short trips under 2 mi</span>
                </button>
              </div>

              {/* Transit apps row */}
              <div style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em"}}>Open in transit apps</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <button className="ab" onClick={()=>window.open("https://www.google.com/maps/dir/?api=1&travelmode=transit","_blank")}
                  style={{flex:1,background:"#141414",border:"1px solid #2a2a2a",borderRadius:8,color:"#9ca3af",padding:"10px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  <span style={{fontSize:14}}>🗺️</span> Google Maps · Transit
                </button>
                <button className="ab" onClick={()=>window.open("https://citymapper.com/","_blank")}
                  style={{flex:1,background:"#141414",border:"1px solid #2a2a2a",borderRadius:8,color:"#9ca3af",padding:"10px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  <span style={{fontSize:14}}>🚇</span> Citymapper
                </button>
                <button className="ab" onClick={()=>window.open("https://transitapp.com/","_blank")}
                  style={{flex:1,background:"#141414",border:"1px solid #2a2a2a",borderRadius:8,color:"#9ca3af",padding:"10px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  <span style={{fontSize:14}}>🚌</span> Transit App
                </button>
              </div>

              {/* Cost comparison cards */}
              <div style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em",marginTop:4}}>Your cheapest options</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {TRANSPORT.map(t=>(
                  <div key={t.label} style={{background:"#0e0e0e",border:"1px solid #181818",borderRadius:10,padding:"12px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <span style={{fontSize:22}}>{t.icon}</span>
                      <div>
                        <div style={{fontSize:12.5,fontWeight:600,color:"#e5e7eb"}}>{t.label}</div>
                        <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"#3b82f6",marginTop:2}}>{t.save}</div>
                      </div>
                    </div>
                    <div style={{fontSize:11,color:"#9ca3af",lineHeight:1.5}}>{t.tip}</div>
                  </div>
                ))}
              </div>

              {/* Savings insight */}
              {transportPct>8&&(
                <div style={{padding:"11px 14px",background:"#0a0f1f",border:"1px solid #3b82f630",borderRadius:10,fontSize:12.5,color:"#93c5fd",lineHeight:1.65}}>
                  💡 You've spent <strong>${(byCat["Transport"]||0).toFixed(0)}</strong> on transport. Switching to bus for the next {daysLeft} days could save ~<strong>${((byCat["Transport"]||0)*0.7).toFixed(0)}</strong>. Just sayin'.
                </div>
              )}

              {/* Ask AI for route */}
              <button className="ab" onClick={()=>send("Compare bus vs Uber for getting around campus — what would save me the most money based on my transport spending?")}
                style={{background:"#3b82f6",border:"none",borderRadius:10,color:"#fff",padding:"11px 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                🤖 Ask AI: cheapest way to get around campus ↗
              </button>

              {/* Pro tip */}
              <div style={{padding:"11px 14px",background:"#0a1a0a",border:"1px solid #22c55e20",borderRadius:10,fontSize:12,color:"#86efac",lineHeight:1.6}}>
                🎓 Most campuses have free shuttles that aren't on Google Maps. Check your university transportation website — you're probably already paying for it in student fees.
              </div>
            </div>
          )}

          {rightTab==="aid"&&(
            <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:12}}>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {Object.entries(AID_TOPICS).map(([key,t])=>(
                  <button key={key} className={`tbtn ${activeAidTopic===key?"active":""}`} onClick={()=>setActiveAid(key)}
                    style={{background:activeAidTopic===key?"#1a1a1a":"transparent",border:`1px solid ${activeAidTopic===key?t.color+"44":"#222"}`,borderRadius:8,padding:"6px 11px",fontSize:12,color:activeAidTopic===key?t.color:"#6b7280",fontWeight:600,fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:5}}>
                    <span>{t.icon}</span>{t.title}
                  </button>
                ))}
              </div>
              <div style={{background:"#0e0e0e",border:`1px solid ${aidTopic.color}30`,borderRadius:14,padding:"18px 20px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}><span style={{fontSize:22}}>{aidTopic.icon}</span><div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{aidTopic.title}</div></div>
                <div style={{fontSize:13,color:"#9ca3af",lineHeight:1.6}}>{aidTopic.desc}</div>
              </div>
              <div style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em"}}>Tap to ask Claude</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {aidTopic.items.map((item,i)=>(
                  <div key={i} className="rc ab" onClick={()=>send(item.prompt)} style={{background:"#0e0e0e",border:"1px solid #181818",borderRadius:11,padding:"13px 15px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                      <div style={{flex:1}}><div style={{fontSize:13.5,fontWeight:600,color:"#e5e7eb",marginBottom:3}}>{item.label}</div><div style={{fontSize:12,color:"#9ca3af",lineHeight:1.55}}>{item.sub}</div></div>
                      <span style={{color:aidTopic.color,fontSize:16,flexShrink:0,marginTop:2}}>↗</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:4,padding:"11px 14px",background:"#0a1a0a",border:"1px solid #22c55e20",borderRadius:10,fontSize:12,color:"#86efac",lineHeight:1.6}}>
                💡 Billions in aid goes unclaimed every year. Your campus financial aid office works for you — use it.
              </div>
            </div>
          )}

          {/* LEGAL AID */}
          {rightTab==="legal"&&(
            <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:12}}>
              <div style={{background:"#0a0f1f",border:"1px solid #3b82f630",borderRadius:10,padding:"10px 13px",fontSize:12,color:"#93c5fd",lineHeight:1.6,display:"flex",gap:8,alignItems:"flex-start"}}>
                <span style={{fontSize:14,flexShrink:0}}>ℹ️</span><span>Not legal advice. This helps you understand your rights and find the right resources. For serious matters, consult a licensed attorney or Student Legal Services.</span>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {Object.entries(LEGAL_SITUATIONS).map(([key,s])=>(
                  <button key={key} className={`tbtn ${activeLegal===key?"active":""}`} onClick={()=>setActiveLegal(key)}
                    style={{background:activeLegal===key?"#1a1a1a":"transparent",border:`1px solid ${activeLegal===key?s.color+"44":"#222"}`,borderRadius:8,padding:"6px 11px",fontSize:12,color:activeLegal===key?s.color:"#6b7280",fontWeight:600,fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:5}}>
                    <span>{s.icon}</span>{s.title}
                  </button>
                ))}
              </div>
              <div style={{background:"#0e0e0e",border:`1px solid ${legalSit.color}30`,borderRadius:14,padding:"18px 20px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}><span style={{fontSize:22}}>{legalSit.icon}</span><div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{legalSit.title}</div></div>
                <div style={{fontSize:13,color:"#9ca3af",lineHeight:1.6}}>{legalSit.desc}</div>
              </div>
              <div style={{background:"#0e0e0e",border:"1px solid #181818",borderRadius:12,padding:"14px 16px"}}>
                <div style={{fontSize:11,fontWeight:600,color:legalSit.color,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>⚖️ Your Rights</div>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {legalSit.rights.map((r,i)=>(
                    <div key={i} style={{display:"flex",gap:9,alignItems:"flex-start",fontSize:12.5,color:"#d1d5db",lineHeight:1.55}}>
                      <span style={{color:legalSit.color,fontFamily:"'Space Mono',monospace",fontSize:11,fontWeight:700,flexShrink:0}}>{String(i+1).padStart(2,"0")}</span><span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:"#0e0e0e",border:"1px solid #181818",borderRadius:12,padding:"14px 16px"}}>
                <div style={{fontSize:11,fontWeight:600,color:legalSit.color,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>✅ Action Checklist</div>
                <div style={{display:"flex",flexDirection:"column",gap:3}}>
                  {legalSit.checklist.map((item,i)=>(
                    <label key={i} className="ck" style={{display:"flex",alignItems:"flex-start",gap:9,padding:"7px 9px",borderRadius:7}}>
                      <input type="checkbox" style={{marginTop:3,accentColor:legalSit.color,flexShrink:0}}/><span style={{fontSize:12.5,color:"#d1d5db",lineHeight:1.55}}>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em"}}>Resources</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {legalSit.resources.map((r,i)=>(
                  <div key={i} className="rc" style={{background:"#0e0e0e",border:"1px solid #181818",borderRadius:11,padding:"12px 15px"}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#e5e7eb",marginBottom:3}}>{r.name}</div>
                    <div style={{fontSize:12,color:"#9ca3af",lineHeight:1.55,marginBottom:6}}>{r.desc}</div>
                    <span style={{fontSize:10,fontWeight:600,background:legalSit.color+"22",color:legalSit.color,padding:"3px 8px",borderRadius:5}}>{r.tag}</span>
                  </div>
                ))}
              </div>
              <button className="ab" onClick={()=>send(`Help me draft a formal letter about my ${legalSit.title.toLowerCase()} situation that I can bring to Student Legal Services`)}
                style={{background:legalSit.color,border:"none",borderRadius:10,color:"#000",padding:"11px 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",marginTop:4}}>
                ✍️ Draft a letter for my situation
              </button>
            </div>
          )}

          {/* EVENTS */}
          {rightTab==="events"&&(
            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

              {/* Stats */}
              <div style={{display:"flex",gap:8,padding:"12px 14px 0",flexShrink:0}}>
                {[{label:"Upcoming",val:ALL_EVENTS.filter(e=>e.date>=TODAY).length,c:"#a855f7"},{label:"Equity-focused",val:ALL_EVENTS.filter(e=>e.equity).length,c:"#22c55e"},{label:"Free today",val:ALL_EVENTS.filter(e=>e.date===TODAY&&e.free).length,c:"#f59e0b"},{label:"My RSVPs",val:rsvpd.size,c:"#3b82f6"}].map(s=>(
                  <div key={s.label} style={{flex:1,background:"#0e0e0e",border:"1px solid #181818",borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:20,fontWeight:700,color:s.c,lineHeight:1}}>{s.val}</div>
                    <div style={{fontSize:10,color:"#6b7280",marginTop:4,lineHeight:1.3}}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* View toggles */}
              <div style={{display:"flex",gap:6,padding:"10px 14px 0",flexShrink:0}}>
                {[["all","All Events"],["equity","✊ Equity"],["rsvp","📌 My RSVPs"]].map(([v,l])=>(
                  <button key={v} className="vt" onClick={()=>setEvView(v)} style={{background:evView===v?"#1e1030":"transparent",color:evView===v?"#a855f7":"#6b7280",border:`1px solid ${evView===v?"#a855f722":"#222"}`}}>{l}</button>
                ))}
              </div>

              {/* Search */}
              <div style={{padding:"10px 14px 0",flexShrink:0}}>
                <input value={evSearch} onChange={e=>setEvSearch(e.target.value)} placeholder="Search events, departments, keywords…"
                  style={{width:"100%",background:"#0e0e0e",border:"1px solid #222",borderRadius:9,color:"#e5e7eb",padding:"8px 12px",fontSize:13,fontFamily:"'Outfit',sans-serif"}}/>
              </div>

              {/* Category chips */}
              <div style={{display:"flex",gap:6,padding:"8px 14px 0",flexShrink:0,flexWrap:"wrap"}}>
                {CATS.map(c=>(
                  <button key={c} className="fb" onClick={()=>setEvCat(c)}
                    style={{background:evCat===c?(CAT_COL[c]||"#a855f7")+"22":"transparent",border:`1px solid ${evCat===c?(CAT_COL[c]||"#a855f7")+"55":"#222"}`,borderRadius:7,padding:"5px 10px",fontSize:11,fontWeight:600,color:evCat===c?(CAT_COL[c]||"#a855f7"):"#6b7280",display:"flex",alignItems:"center",gap:4}}>
                    {c!=="All"&&<span style={{fontSize:12}}>{CAT_ICO[c]}</span>}{c}
                  </button>
                ))}
              </div>

              {/* Event cards */}
              <div style={{flex:1,overflowY:"auto",padding:"10px 14px 14px",display:"flex",flexDirection:"column",gap:8}}>
                {filtered.length===0&&(
                  <div style={{textAlign:"center",padding:"40px 20px",color:"#374151"}}>
                    <div style={{fontSize:28,marginBottom:8}}>📭</div>
                    <div style={{fontSize:13,marginBottom:10}}>No events match your filters.</div>
                    <button onClick={()=>{setEvCat("All");setEvSearch("");setEvView("all");}} style={{background:"transparent",border:"1px solid #333",borderRadius:8,color:"#6b7280",padding:"6px 14px",fontSize:12,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Clear filters</button>
                  </div>
                )}
                {filtered.map(ev=>{
                  const isR=rsvpd.has(ev.id); const isEx=expanded===ev.id;
                  const cc=CAT_COL[ev.category]||"#a855f7";
                  const urgent=ev.spotsLeft<=5&&ev.spotsLeft<ev.spots?"#ef4444":ev.spotsLeft<=10&&ev.spotsLeft<ev.spots?"#f59e0b":null;
                  return (
                    <div key={ev.id} className="evc" onClick={()=>setExpanded(isEx?null:ev.id)}
                      style={{background:"#0e0e0e",border:`1px solid ${isR?cc+"55":"#181818"}`,borderRadius:12,padding:"13px 15px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:8}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5,flexWrap:"wrap"}}>
                            <span style={{fontSize:11,fontWeight:600,background:cc+"22",color:cc,padding:"2px 8px",borderRadius:5}}>{CAT_ICO[ev.category]} {ev.category}</span>
                            {ev.equity&&<span style={{fontSize:10,fontWeight:600,background:"#22c55e22",color:"#22c55e",padding:"2px 7px",borderRadius:5}}>✊ Equity</span>}
                            {ev.free&&<span style={{fontSize:10,fontWeight:600,background:"#f59e0b22",color:"#f59e0b",padding:"2px 7px",borderRadius:5}}>FREE</span>}
                            {isR&&<span style={{fontSize:10,fontWeight:600,background:"#3b82f622",color:"#3b82f6",padding:"2px 7px",borderRadius:5}}>📌 RSVP'd</span>}
                          </div>
                          <div style={{fontSize:14,fontWeight:600,color:"#e5e7eb",lineHeight:1.3,marginBottom:3}}>{ev.title}</div>
                          <div style={{fontSize:11,color:"#6b7280"}}>{ev.dept}</div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontFamily:"'Space Mono',monospace",fontSize:11,fontWeight:700,color:cc}}>{daysUntil(ev.date)}</div>
                          <div style={{fontSize:10,color:"#6b7280",marginTop:2}}>{fmtDate(ev.date)}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                        <span style={{fontSize:11,color:"#6b7280"}}>🕐 {ev.time}</span>
                        <span style={{fontSize:11,color:"#6b7280"}}>📍 {ev.location}</span>
                        {urgent&&<span style={{fontSize:11,color:urgent,fontWeight:600}}>⚡ {ev.spotsLeft} spots left</span>}
                      </div>
                      {isEx&&(
                        <div style={{marginTop:12,animation:"sIn .2s ease"}}>
                          <div style={{fontSize:12.5,color:"#9ca3af",lineHeight:1.65,marginBottom:12,paddingTop:10,borderTop:"1px solid #1e1e1e"}}>{ev.desc}</div>
                          <div style={{display:"flex",gap:8,alignItems:"center"}}>
                            <button className="rb" onClick={e=>{e.stopPropagation();setRsvpd(prev=>{const n=new Set(prev);isR?n.delete(ev.id):n.add(ev.id);return n;});}}
                              style={{flex:1,background:isR?"#1a1a1a":cc,border:isR?`1px solid ${cc}44`:"none",borderRadius:8,color:isR?cc:"#000",padding:"9px 14px",fontSize:12.5,fontWeight:700}}>
                              {isR?"✓ Remove RSVP":"📌 RSVP — I'm going"}
                            </button>
                            <button className="rb" onClick={e=>{e.stopPropagation();send(`Tell me more about "${ev.title}" on ${ev.date} by ${ev.dept} — is it worth attending?`);}}
                              style={{background:"#141414",border:"1px solid #2a2a2a",borderRadius:8,color:"#9ca3af",padding:"9px 14px",fontSize:12,fontWeight:600}}>
                              Ask AI ↗
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* AI recommend */}
                <div className="evc ab" onClick={()=>send("What campus events would help me most right now — based on my financial situation and what I've asked about?")}
                  style={{background:"transparent",border:"1px dashed #a855f730",borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                  <span style={{fontSize:18}}>✨</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:"#a855f7"}}>Ask AI to recommend events for me</div>
                    <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>Personalized based on your situation ↗</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
