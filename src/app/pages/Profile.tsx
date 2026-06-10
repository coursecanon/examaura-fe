import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router';
import { useUser } from '../context/UserContext';
import { useQuizzes } from '../context/QuizContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { User, Bell, BookOpen, Edit3, Plus, Clock, Trophy, Lock, LogOut, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api/axiosConfig'; // Ensure you import your api instance

interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

export function Profile() {
  const { user, isLoggedIn, logout } = useUser();
  const navigate = useNavigate();

// Async API State Hooks
  const [userCreatedQuizzes, setUserCreatedQuizzes] = useState<any[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [notifications] = useState<Notification[]>([]); // Connect to a notification endpoint if needed later

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Dual Endpoint Dispatch
  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoadingData(true);
        const [quizzesResponse, attemptsResponse] = await Promise.all([
          api.get(`/quizzes/${user.id}/latest`),
          api.get(`/attempts/${user.id}/recent`)
        ]);

        console.log("Quizzes Response:", quizzesResponse);
        console.log("Attempts Response:", attemptsResponse);

        setUserCreatedQuizzes(quizzesResponse.data);
        setRecentAttempts(attemptsResponse.data);
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
        toast.error("Error updating metrics scorecard profile layout.");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isLoggedIn) {
      fetchDashboardMetrics();
    }
  }, [user?.id, isLoggedIn]);

  // Redirect if not logged in
  if (!isLoggedIn) return <Navigate to="/" replace />;

  const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

console.log("User Created Quizzes:", userCreatedQuizzes);
console.log("Recent Attempts:", recentAttempts);
console.log("Notifications:", notifications);
console.log("User Info:", user);
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      await api.post('/auth/update-password', { currentPassword, newPassword });
      toast.success('Password updated successfully');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch {
      toast.error('Failed to update password');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const handleEditQuiz = (quizId: string) => {
    // Navigate to create quiz page with quiz ID as state for editing
    navigate('/create-quiz', { state: { editQuizId: quizId } });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="p-6 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white border-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                  {/* <User className="w-10 h-10 text-white" /> */}
                  <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="rounded-full object-cover border-2 border-[#1e40af]/20"
                    />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{user?.name}</h1>
                  <p className="text-blue-100 mt-1">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {/* {userHistory.length} */}Total Attempts
                    </Badge>
                    <Badge className="bg-white/20 text-white border-white/30">
                      {userCreatedQuizzes.length} Quizzes Created
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Notifications Badge */}
              <div className="relative">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                  <Bell className="w-5 h-5" />
                  <span className="font-medium">{notifications.filter(n => !n.read).length} New</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs Layout */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-white border border-border p-1 rounded-xl">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#1e40af] data-[state=active]:text-white rounded-lg">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="data-[state=active]:bg-[#1e40af] data-[state=active]:text-white rounded-lg">
              My Quizzes
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#1e40af] data-[state=active]:text-white rounded-lg">
              Account Settings
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          {/* Notifications Tab Content */}
          <TabsContent value="dashboard" className="space-y-6">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-6 h-6 text-[#1e40af]" />
                <h2 className="text-2xl font-semibold">Notifications</h2>
              </div>
              <Card className="divide-y divide-border">
                {notifications.length > 0 ? notifications.map((notif) => (
                  <div key={notif.id} className={`px-6 py-4 flex items-start gap-3 ${!notif.read ? 'bg-blue-50' : 'bg-white'}`}>
                    {/* ... (Render Notification Item) ... */}
                  </div>
                )) : <p className="p-6 text-slate-500">No new notifications.</p>}
              </Card>
            </section>

            {/* Recent Activity Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-[#1e40af]" />
                <h2 className="text-2xl font-semibold">Recent Activity</h2>
              </div>
              {recentAttempts.length > 0 ? (
                <Card className="divide-y divide-border">
                    {recentAttempts.map((entry, idx) => (
                      <div key={entry.attemptId} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 truncate">{entry.quizName}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-slate-500 font-medium capitalize bg-slate-100 px-2 py-0.5 rounded-md">{entry.category}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(entry.completedAt)}
                              </span>
                            </div>
                          </div>
                        <Badge variant={getScoreBadgeVariant(entry.passedScore)}>{entry.passedScore}%</Badge>
                      </div>
                    ))}
                </Card>
              ) : (
                <Card className="p-8 text-center">
                  <p>No quiz attempts yet.</p>
                </Card>
              )}
            </section>
          </TabsContent>

          {/* My Quizzes Tab */}
          <TabsContent value="quizzes" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-[#1e40af]" />
                <h2 className="text-2xl font-semibold">Your Quizzes</h2>
              </div>
              <Link to="/create-quiz">
                <Button className="bg-[#10b981] hover:bg-[#059669] text-white gap-2">
                  <Plus className="w-4 h-4" />
                  Create New Quiz
                </Button>
              </Link>
            </div>

            {userCreatedQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCreatedQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="p-6 hover:shadow-lg transition-all duration-300 border-2 border-border rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{quiz.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {quiz.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {quiz.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{quiz.totalQuestions} Questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{quiz.durationMinutes} Minutes</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditQuiz(quiz.id)}
                        className="flex-1 bg-[#1e40af] hover:bg-[#1e3a8a] text-white gap-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </Button>
                      <Link to={`/quiz/${quiz.id}/instructions`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Take Quiz
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No Quizzes Yet</h3>
                <p className="text-slate-500 mb-6">
                  Create your first quiz to get started
                </p>
                <Link to="/create-quiz">
                  <Button className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white gap-2">
                    <Plus className="w-4 h-4" />
                    Create Your First Quiz
                  </Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Update Password Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-[#1e40af]" />
                <h2 className="text-2xl font-semibold">Update Password</h2>
              </div>
              <Card className="p-6">
                <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                  <div>
                    <Label htmlFor="current-password" className="text-slate-700">
                      Current Password
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-password" className="text-slate-700">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 8 characters)"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirm-password" className="text-slate-700">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="mt-1.5"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white"
                  >
                    Update Password
                  </Button>
                </form>
              </Card>
            </section>

            {/* Logout Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <LogOut className="w-6 h-6 text-[#dc2626]" />
                <h2 className="text-2xl font-semibold">Account Actions</h2>
              </div>
              <Card className="p-6">
                <div className="max-w-md">
                  <h3 className="font-semibold text-slate-900 mb-2">Logout</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Sign out of your account and return to the home page
                  </p>
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="gap-2 bg-[#dc2626] hover:bg-[#b91c1c]"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </Card>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
