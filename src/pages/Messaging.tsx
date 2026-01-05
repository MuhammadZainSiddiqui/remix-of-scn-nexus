import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageSquare, Lock, Search, Send, Bell } from 'lucide-react';
import { useMessages, useConversations, useNotifications } from '@/hooks/useMessaging';
import { LoadingSpinner, LoadingTable } from '@/components/shared/LoadingSpinner';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import { Pagination } from '@/components/shared/Pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Messaging() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data: messagesData, isLoading: messagesLoading, error: messagesError } = useMessages(
    { search: searchQuery },
    page,
    10
  );

  const { data: conversationsData } = useConversations();

  const { data: notificationsData } = useNotifications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Messaging</h1>
        <p className="text-sm text-muted-foreground">Email, SMS, WhatsApp, and Portal notifications</p>
      </div>

      {messagesError && <ErrorAlert error={messagesError} title="Failed to load messages" />}

      <Tabs defaultValue="messages" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Message Log</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {messagesLoading ? (
                <LoadingTable />
              ) : messagesData?.data && messagesData.data.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Channel</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {messagesData.data.map((msg) => (
                        <TableRow key={msg.id} className={msg.restricted ? 'bg-red-50/50' : ''}>
                          <TableCell><Badge variant="outline">{msg.type}</Badge></TableCell>
                          <TableCell>{msg.recipient}</TableCell>
                          <TableCell>{msg.subject}</TableCell>
                          <TableCell>
                            {msg.restricted ? (
                              <Badge className="status-restricted gap-1"><Lock className="w-3 h-3" />{msg.channel}</Badge>
                            ) : (
                              <Badge variant="outline">{msg.channel}</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">{msg.created_at}</TableCell>
                          <TableCell><Badge className={msg.status === 'sent' ? 'status-approved' : 'status-pending'}>{msg.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Pagination
                    page={page}
                    totalPages={messagesData.pagination.totalPages}
                    total={messagesData.pagination.total}
                    onPageChange={setPage}
                    className="mt-4"
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-1">No messages found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {searchQuery ? "Try adjusting your search" : "No messages have been sent yet"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversations Tab */}
        <TabsContent value="conversations">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conversations</CardTitle>
              <CardDescription>Direct and group messaging threads</CardDescription>
            </CardHeader>
            <CardContent>
              {conversationsData && conversationsData.length > 0 ? (
                <div className="space-y-2">
                  {conversationsData.map((conv) => (
                    <div key={conv.id} className="p-4 rounded-lg bg-muted/50 border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Send className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{conv.subject}</p>
                          <p className="text-sm text-muted-foreground">
                            {conv.participants} participants • Last message {conv.last_message_at}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{conv.type}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Send className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-1">No conversations found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Start a conversation to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notifications</CardTitle>
              <CardDescription>System and user notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {notificationsData && notificationsData.length > 0 ? (
                <div className="space-y-2">
                  {notificationsData.map((notif) => (
                    <div key={notif.id} className={`p-4 rounded-lg border flex items-center justify-between ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{notif.title}</p>
                          <p className="text-sm text-muted-foreground">{notif.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{notif.created_at}</Badge>
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-1">No notifications found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    You have no notifications at this time
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="p-4 rounded-lg bg-muted/50 border text-sm text-muted-foreground">
        <strong>Portal-Only Rule:</strong> Restricted alerts display "Portal-only alert sent — no details via SMS / WhatsApp / Email."
      </div>
    </div>
  );
}
