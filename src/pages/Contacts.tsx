import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Search, Plus, Building, User, Heart, Briefcase, HandHeart } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useDonors, Contact } from '@/hooks/useContacts';
import { LoadingSpinner, LoadingTable } from '@/components/shared/LoadingSpinner';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import { EmptyTable } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { useToast } from '@/hooks/use-toast';

const volunteers = [
  { id: 1, name: 'Samina Yousuf', email: 'samina@email.com', vertical: 'Educare Academy', status: 'Active', hours: 156 },
  { id: 2, name: 'Imran Ali', email: 'imran@email.com', vertical: 'Humanitarian Relief', status: 'Active', hours: 89 },
];

const parents = [
  { id: 1, name: 'Mr. Ahmed Khan', email: 'ahmed.khan@email.com', children: 2, vertical: 'Educare Academy', status: 'Active' },
  { id: 2, name: 'Mrs. Fatima Noor', email: 'f.noor@email.com', children: 1, vertical: 'Educare Academy', status: 'Active' },
];

const vendors = [
  { id: 1, name: 'ABC Supplies Ltd', contact: 'Mr. Nasir', email: 'contact@abcsupplies.pk', category: 'Office Supplies', status: 'Approved', score: 4.2 },
  { id: 2, name: 'MediEquip Pakistan', contact: 'Dr. Saleem', email: 'sales@mediequip.pk', category: 'Medical Equipment', status: 'Approved', score: 4.5 },
  { id: 3, name: 'EduBooks International', contact: 'Ms. Sara', email: 'orders@edubooks.pk', category: 'Educational Materials', status: 'Under Review', score: null },
];

const partners = [
  { id: 1, name: 'UNICEF Pakistan', type: 'UN Agency', contact: 'Ms. Jennifer Liu', email: 'j.liu@unicef.org', status: 'Active' },
  { id: 2, name: 'Engro Foundation', type: 'CSR Partner', contact: 'Mr. Asad Umar', email: 'partnerships@engro.com', status: 'Active' },
];

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentVertical } = useApp();
  const { toast } = useToast();

  const [donorPage, setDonorPage] = useState(1);
  const { data: donorsData, isLoading: donorsLoading, error: donorsError } = useDonors(
    { search: searchQuery },
    donorPage,
    10
  );

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleAddContact = () => {
    toast({
      title: "Add Contact",
      description: "Opening contact form...",
    });
  };

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Contacts (CRM)</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage donors, parents, volunteers, vendors, and partners
          </p>
        </div>
        <Button className="gap-2" onClick={handleAddContact}>
          <Plus className="w-4 h-4" />
          Add Contact
        </Button>
      </div>

      {donorsError && (
        <ErrorAlert error={donorsError} title="Failed to load contacts" />
      )}

      <Tabs defaultValue="donors" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="donors" className="gap-2">
            <HandHeart className="w-4 h-4" />
            Donors
          </TabsTrigger>
          <TabsTrigger value="parents" className="gap-2">
            <User className="w-4 h-4" />
            Parents
          </TabsTrigger>
          <TabsTrigger value="volunteers" className="gap-2">
            <Heart className="w-4 h-4" />
            Volunteers
          </TabsTrigger>
          <TabsTrigger value="vendors" className="gap-2">
            <Briefcase className="w-4 h-4" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="partners" className="gap-2">
            <Building className="w-4 h-4" />
            Partners / CSR
          </TabsTrigger>
        </TabsList>

        {/* Donors Tab */}
        <TabsContent value="donors">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Donors</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search donors..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {donorsLoading ? (
                <LoadingTable />
              ) : donorsData?.data && donorsData.data.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Total Donated</TableHead>
                        <TableHead>Last Donation</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {donorsData.data.map((donor) => (
                        <TableRow key={donor.id}>
                          <TableCell className="font-medium">{donor.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{donor.contact_type || 'Individual'}</Badge>
                          </TableCell>
                          <TableCell>PKR {donor.total_donated?.toLocaleString() || '0'}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {donor.last_donation || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{donor.name}</p>
                              <p className="text-xs text-muted-foreground">{donor.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="status-active">{donor.status || 'Active'}</Badge>
                          </TableCell>
                          <TableCell>
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button variant="ghost" size="sm">View</Button>
                              </SheetTrigger>
                              <SheetContent>
                                <SheetHeader>
                                  <SheetTitle>{donor.name}</SheetTitle>
                                  <SheetDescription>Donor Profile & Interaction History</SheetDescription>
                                </SheetHeader>
                                <div className="mt-6 space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-lg bg-muted/50">
                                      <p className="text-xs text-muted-foreground">Total Donated</p>
                                      <p className="text-lg font-semibold">PKR {donor.total_donated?.toLocaleString() || '0'}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted/50">
                                      <p className="text-xs text-muted-foreground">Last Donation</p>
                                      <p className="text-lg font-semibold">{donor.last_donation || 'N/A'}</p>
                                    </div>
                                  </div>
                                  <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">Contact Information</h4>
                                    <p className="text-sm">{donor.name}</p>
                                    <p className="text-sm text-muted-foreground">{donor.email}</p>
                                  </div>
                                </div>
                              </SheetContent>
                            </Sheet>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Pagination
                    page={donorPage}
                    totalPages={donorsData.pagination.totalPages}
                    total={donorsData.pagination.total}
                    onPageChange={setDonorPage}
                    className="mt-4"
                  />
                </>
              ) : (
                <EmptyTable
                  title="No donors found"
                  description={searchQuery ? "Try adjusting your search" : "Add your first donor to get started"}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parents Tab */}
        <TabsContent value="parents">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Parents (Educare)</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search parents..." className="pl-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Children Enrolled</TableHead>
                    <TableHead>Vertical</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parents.map((parent) => (
                    <TableRow key={parent.id}>
                      <TableCell className="font-medium">{parent.name}</TableCell>
                      <TableCell className="text-muted-foreground">{parent.email}</TableCell>
                      <TableCell>{parent.children}</TableCell>
                      <TableCell>{parent.vertical}</TableCell>
                      <TableCell>
                        <Badge className="status-active">{parent.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Volunteers Tab */}
        <TabsContent value="volunteers">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Volunteers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Vertical</TableHead>
                    <TableHead>Hours Contributed</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteers.map((vol) => (
                    <TableRow key={vol.id}>
                      <TableCell className="font-medium">{vol.name}</TableCell>
                      <TableCell className="text-muted-foreground">{vol.email}</TableCell>
                      <TableCell>{vol.vertical}</TableCell>
                      <TableCell>{vol.hours} hrs</TableCell>
                      <TableCell>
                        <Badge className="status-active">{vol.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{vendor.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{vendor.contact}</p>
                          <p className="text-xs text-muted-foreground">{vendor.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {vendor.score ? (
                          <span className="font-medium">{vendor.score}/5.0</span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={vendor.status === 'Approved' ? 'status-approved' : 'status-pending'}>
                          {vendor.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Partners Tab */}
        <TabsContent value="partners">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Partners / CSR</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">{partner.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{partner.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{partner.contact}</p>
                          <p className="text-xs text-muted-foreground">{partner.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="status-active">{partner.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
