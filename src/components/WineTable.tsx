import React, { useEffect, useState } from 'react'
import CustomTable from './CustomTable';
import { GetWineReturn } from '@/service/wine.service';
import { getWines } from '@/app/wine/add/_actions';
import { useSession } from 'next-auth/react';
import { Box, CircularProgress } from '@mui/joy';
import { IS_DEVELOPER, PAGES } from '@/common';

function WineTable() {
    const [wines, setWines] = useState<GetWineReturn[]>()
    const { data: session } = useSession();
    if (!(session?.user as any)?.id) return <CircularProgress></CircularProgress>;

    useEffect(() => {
        getWines((session?.user as any)?.id).then((strWine) => {
            const wines: GetWineReturn[] = JSON.parse(strWine);
            setWines(wines);
            IS_DEVELOPER && console.log(wines)
        });
    }, []);

    return (
        <Box>
            {wines && wines?.length > 0 && <CustomTable
                canDelete={true}
                handleDeleteAll={async (selected: readonly string[]) => {
                    // await deletePeople(selected.map(id => Number(id)));
                    // fetchData(null)
                }}
                data={wines.map(w => ({
                    "name": w.name || "",
                    "year": w.year,
                    "type": w.type || "",
                    "rating": w.rating || "",
                    "consumed": w.consumed ? "Yes" : "No",
                    "date_consumed": w.date_consumed || "N/A",
                    "id": w._id
                }))}
                onDelete={(row) => {
                    // setConfirmDelete(String(row.id))
                }}
                editPage={PAGES.edit}
                columns={columns}
                title="Favourite Wines list"
            />}
        </Box>
    )
}
const columns = [
    { id: 'name', numeric: false, label: 'Name' },
    { id: 'year', numeric: false, label: 'Year' },
    { id: 'type', numeric: false, label: 'Type' },
    { id: 'rating', numeric: true, label: 'Rating' },
    { id: 'consumed', numeric: false, label: 'Consumed' },
    { id: 'date_consumed', numeric: false, label: 'Date consumed' },
];
export default WineTable