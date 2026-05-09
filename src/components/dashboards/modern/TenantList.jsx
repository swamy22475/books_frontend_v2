import React, { useEffect, useState } from "react";
import CardBox from "src/components/shared/CardBox";
import { Badge } from "src/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "src/components/ui/table";
import { api } from "src/lib/api-client";

export const TenantList = () => {
    const [schools, setSchools] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const response = await api.get('/master/schools/');
                setSchools(response.schools || []);
            } catch (err) {
                console.error("Error fetching schools", err);
                setError("Failed to load schools dataset.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchools();
    }, []);

    return (
        <CardBox>
            <div className="mb-6">
                <div>
                    <h5 className="card-title">Registered Schools (Tenants)</h5>
                    <p className="text-sm text-muted-foreground font-normal">Overview of all schools in the system</p>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-sm font-semibold">School Name</TableHead>
                                        <TableHead className="text-sm font-semibold">Code / Subdomain</TableHead>
                                        <TableHead className="text-sm font-semibold">Contact</TableHead>
                                        <TableHead className="text-sm font-semibold">Status</TableHead>
                                        <TableHead className="text-sm font-semibold">Database</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-4">
                                                Loading schools...
                                            </TableCell>
                                        </TableRow>
                                    ) : schools.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                                No schools found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        schools.map((school) => (
                                            <TableRow key={school.id} className="border-b border-border">
                                                <TableCell className="ps-0 min-w-[200px]">
                                                    <div>
                                                        <h6 className="text-sm font-semibold mb-1">{school.name}</h6>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <div>
                                                        <span className="font-medium text-sm text-muted-foreground block">
                                                            {school.code}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {school.subdomain}.erp.com
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <span className="text-sm text-muted-foreground block">
                                                        {school.email || 'No email provided'}
                                                    </span>
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        className={`text-[13px] px-3 justify-center py-0.5 ${school.is_active
                                                                ? "bg-success text-white"
                                                                : "bg-error text-white"
                                                            }`}
                                                    >
                                                        {school.is_active ? "Active" : "Inactive"}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell>
                                                    <p className="text-[13px] font-medium text-muted-foreground">
                                                        {school.db_name}
                                                    </p>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </CardBox>
    );
};
