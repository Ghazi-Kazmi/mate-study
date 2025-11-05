import { useState } from "react";
import { Users, Search, Calendar, MessageCircle, FileText, Plus, Settings, LogOut, BookOpen, Clock, UserPlus, Filter, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Page = "login" | "register" | "dashboard" | "discovery" | "groupDetail";
type RSVPStatus = "attending" | "maybe" | "cant-go" | null;

interface Group {
  id: string;
  name: string;
  courseCode: string;
  description: string;
  members: number;
  capacity: number;
  isPublic: boolean;
  nextSession?: string;
}

interface Session {
  id: string;
  groupId: string;
  groupName: string;
  topic: string;
  date: string;
  time: string;
  rsvp?: RSVPStatus;
}

const StudyCircle = () => {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isScheduleSessionOpen, setIsScheduleSessionOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const myGroups: Group[] = [
    { id: "1", name: "COMP101 Study Group", courseCode: "COMP101", description: "Intro to Computer Science", members: 8, capacity: 10, isPublic: true, nextSession: "Today, 7:00 PM" },
    { id: "2", name: "Math Wizards", courseCode: "MATH201", description: "Calculus II study sessions", members: 5, capacity: 8, isPublic: true, nextSession: "Tomorrow, 3:00 PM" },
  ];

  const upcomingSessions: Session[] = [
    { id: "s1", groupId: "1", groupName: "COMP101 Study Group", topic: "Midterm Review", date: "Today", time: "7:00 PM", rsvp: "attending" },
    { id: "s2", groupId: "2", groupName: "Math Wizards", topic: "Integration Techniques", date: "Tomorrow", time: "3:00 PM", rsvp: null },
  ];

  const recommendedGroups: Group[] = [
    { id: "3", name: "Physics Lab Partners", courseCode: "PHYS150", description: "Lab work collaboration", members: 4, capacity: 6, isPublic: true },
    { id: "4", name: "Data Structures Deep Dive", courseCode: "COMP202", description: "Advanced DS&A practice", members: 6, capacity: 8, isPublic: true },
    { id: "5", name: "Chemistry Quiz Prep", courseCode: "CHEM101", description: "Weekly quiz preparation", members: 7, capacity: 10, isPublic: true },
  ];

  const allGroups = [...myGroups, ...recommendedGroups];

  const groupSessions: Session[] = [
    { id: "s1", groupId: "1", groupName: "COMP101 Study Group", topic: "Midterm Review", date: "Today", time: "7:00 PM" },
    { id: "s3", groupId: "1", groupName: "COMP101 Study Group", topic: "Final Project Planning", date: "Friday", time: "5:00 PM" },
  ];

  const members = [
    { id: "1", name: "Alex Johnson", avatar: "AJ" },
    { id: "2", name: "Sarah Chen", avatar: "SC" },
    { id: "3", name: "Mike Torres", avatar: "MT" },
    { id: "4", name: "Emma Davis", avatar: "ED" },
    { id: "5", name: "James Wilson", avatar: "JW" },
    { id: "6", name: "Lisa Park", avatar: "LP" },
    { id: "7", name: "David Kim", avatar: "DK" },
    { id: "8", name: "Maya Patel", avatar: "MP" },
  ];

  const resources = [
    { id: "1", name: "Chapter 1 - Introduction.pdf", type: "PDF", uploadedBy: "Alex Johnson" },
    { id: "2", name: "Midterm Study Guide.docx", type: "DOC", uploadedBy: "Sarah Chen" },
    { id: "3", name: "Practice Problems.pdf", type: "PDF", uploadedBy: "Mike Torres" },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage("dashboard");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setCurrentPage("login");
    setLoginEmail("");
    setLoginPassword("");
  };

  const GroupCard = ({ group, showJoin = false }: { group: Group; showJoin?: boolean }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-border bg-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {group.name}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              <Badge variant="secondary" className="font-medium">
                {group.courseCode}
              </Badge>
            </CardDescription>
          </div>
          <Users className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{group.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {group.members}/{group.capacity} members
          </span>
          <Button
            variant={showJoin ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedGroup(group);
              setCurrentPage("groupDetail");
            }}
            className="transition-all duration-200"
          >
            {showJoin ? (
              <>
                <UserPlus className="h-4 w-4 mr-1" />
                Join
              </>
            ) : (
              <>
                View
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
        {group.nextSession && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-accent font-medium">
              <Clock className="h-3.5 w-3.5" />
              Next: {group.nextSession}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const SessionCard = ({ session, showRSVP = false }: { session: Session; showRSVP?: boolean }) => {
    const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>(session.rsvp || null);

    return (
      <div className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">{session.topic}</h4>
            <p className="text-sm text-muted-foreground mt-1">{session.groupName}</p>
          </div>
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Clock className="h-4 w-4" />
          {session.date}, {session.time}
        </div>
        {showRSVP && (
          <div className="flex gap-2">
            <Button
              variant={rsvpStatus === "attending" ? "default" : "outline"}
              size="sm"
              onClick={() => setRsvpStatus("attending")}
              className="flex-1"
            >
              Attending
            </Button>
            <Button
              variant={rsvpStatus === "maybe" ? "default" : "outline"}
              size="sm"
              onClick={() => setRsvpStatus("maybe")}
              className="flex-1"
            >
              Maybe
            </Button>
            <Button
              variant={rsvpStatus === "cant-go" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setRsvpStatus("cant-go")}
              className="flex-1"
            >
              Can't Go
            </Button>
          </div>
        )}
      </div>
    );
  };

  const Navbar = () => (
    <nav className="bg-primary border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <button onClick={() => setCurrentPage("dashboard")} className="flex items-center gap-2 group">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
              <span className="text-xl font-bold text-primary-foreground group-hover:opacity-80 transition-opacity">
                Study Circle
              </span>
            </button>
            <div className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                onClick={() => setCurrentPage("dashboard")}
                className={`text-primary-foreground hover:bg-primary-foreground/10 ${
                  currentPage === "dashboard" ? "bg-primary-foreground/10" : ""
                }`}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                onClick={() => setCurrentPage("discovery")}
                className={`text-primary-foreground hover:bg-primary-foreground/10 ${
                  currentPage === "discovery" ? "bg-primary-foreground/10" : ""
                }`}
              >
                Find Groups
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-card">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-foreground">Create Study Group</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Start a new study group and invite your peers to join.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="group-name" className="text-foreground font-medium">Group Name</Label>
                    <Input id="group-name" placeholder="e.g., COMP101 Study Group" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course-code" className="text-foreground font-medium">Course Code</Label>
                    <Input id="course-code" placeholder="e.g., COMP101" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-foreground font-medium">Description</Label>
                    <Textarea id="description" placeholder="What's this group about?" className="bg-background" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="capacity" className="text-foreground font-medium">Capacity</Label>
                      <Input id="capacity" type="number" placeholder="10" className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="privacy" className="text-foreground font-medium">Privacy</Label>
                      <Select>
                        <SelectTrigger id="privacy" className="bg-background">
                          <SelectValue placeholder="Public" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsCreateGroupOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-md">
                      Create Group
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <div className="relative group">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 rounded-full">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm">
                  JD
                </div>
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-muted rounded-lg flex items-center gap-2 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  const LoginPage = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">Welcome back!</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Sign in to continue your study journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="bg-background"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="bg-background"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground font-semibold shadow-md">
              Sign In
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                onClick={() => setCurrentPage("register")}
                className="text-accent hover:text-accent/80 font-semibold transition-colors"
              >
                Join the Circle
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const RegisterPage = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">Join the Circle!</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Create your account and start collaborating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg-name" className="text-foreground font-medium">Full Name</Label>
              <Input
                id="reg-name"
                type="text"
                placeholder="John Doe"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                className="bg-background"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-email" className="text-foreground font-medium">Email</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="you@university.edu"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="bg-background"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-password" className="text-foreground font-medium">Password</Label>
              <Input
                id="reg-password"
                type="password"
                placeholder="••••••••"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="bg-background"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground font-semibold shadow-md">
              Create Account
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => setCurrentPage("login")}
                className="text-accent hover:text-accent/80 font-semibold transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const DashboardPage = () => (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, John!</h1>
          <p className="text-lg text-muted-foreground">Here's what's happening with your study groups</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Groups */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Users className="h-6 w-6 text-accent" />
                  My Groups
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myGroups.map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-accent" />
                  Recommended Groups
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedGroups.slice(0, 2).map((group) => (
                  <GroupCard key={group.id} group={group} showJoin />
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Clock className="h-6 w-6 text-accent" />
              Upcoming Sessions
            </h2>
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <SessionCard key={session.id} session={session} showRSVP />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const DiscoveryPage = () => (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-6">Find Your Study Group</h1>
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search groups by name or course code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-card shadow-sm"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Select>
                <SelectTrigger className="w-full md:w-[180px] h-12 bg-card">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Course Code" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comp">COMP</SelectItem>
                  <SelectItem value="math">MATH</SelectItem>
                  <SelectItem value="phys">PHYS</SelectItem>
                  <SelectItem value="chem">CHEM</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-[150px] h-12 bg-card">
                  <SelectValue placeholder="Privacy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allGroups.map((group) => (
            <GroupCard key={group.id} group={group} showJoin />
          ))}
        </div>
      </div>
    </>
  );

  const GroupDetailPage = () => {
    if (!selectedGroup) return null;

    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-foreground mb-2">{selectedGroup.name}</h1>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary" className="font-semibold">
                    {selectedGroup.courseCode}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {selectedGroup.members}/{selectedGroup.capacity} members
                  </span>
                </div>
                <p className="text-lg text-muted-foreground max-w-3xl">{selectedGroup.description}</p>
              </div>
              <Button className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground font-semibold shadow-md">
                <UserPlus className="h-4 w-4 mr-2" />
                Join Group
              </Button>
            </div>
          </div>

          <Tabs defaultValue="sessions" className="space-y-6">
            <TabsList className="bg-card border border-border shadow-sm">
              <TabsTrigger value="sessions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Sessions
              </TabsTrigger>
              <TabsTrigger value="members" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="h-4 w-4 mr-2" />
                Members
              </TabsTrigger>
              <TabsTrigger value="chat" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileText className="h-4 w-4 mr-2" />
                Resources
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sessions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Study Sessions</h2>
                <Dialog open={isScheduleSessionOpen} onOpenChange={setIsScheduleSessionOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] bg-card">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-foreground">Schedule Study Session</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Plan a new study session for your group.
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="topic" className="text-foreground font-medium">Session Topic</Label>
                        <Input id="topic" placeholder="e.g., Midterm Review" className="bg-background" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date" className="text-foreground font-medium">Date</Label>
                          <Input id="date" type="date" className="bg-background" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time" className="text-foreground font-medium">Time</Label>
                          <Input id="time" type="time" className="bg-background" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-foreground font-medium">Location (Optional)</Label>
                        <Input id="location" placeholder="e.g., Library Room 203" className="bg-background" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes" className="text-foreground font-medium">Notes (Optional)</Label>
                        <Textarea id="notes" placeholder="Any additional information..." className="bg-background" />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsScheduleSessionOpen(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-md">
                          Schedule
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-3">
                {groupSessions.map((session) => (
                  <SessionCard key={session.id} session={session} showRSVP />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Group Members</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => (
                  <Card key={member.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{member.name}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-4">
              <Card className="h-[500px] flex flex-col">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-xl font-bold text-foreground">Group Chat</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-6 bg-muted/30">
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-lg">Chat interface coming soon!</p>
                      <p className="text-sm mt-1">Connect with your study group in real-time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Shared Resources</h2>
                <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>
              <div className="space-y-3">
                {resources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-10 w-10 text-accent" />
                        <div>
                          <p className="font-semibold text-foreground">{resource.name}</p>
                          <p className="text-sm text-muted-foreground">Uploaded by {resource.uploadedBy}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {currentPage === "login" && <LoginPage />}
      {currentPage === "register" && <RegisterPage />}
      {currentPage === "dashboard" && <DashboardPage />}
      {currentPage === "discovery" && <DiscoveryPage />}
      {currentPage === "groupDetail" && <GroupDetailPage />}
    </div>
  );
};

export default StudyCircle;
