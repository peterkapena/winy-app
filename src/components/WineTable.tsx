import React, { useEffect, useState } from 'react'
import CustomTable from './CustomTable';
import { GetWineReturn } from '@/service/wine.service';
import { _delete, getWines } from '@/app/wine/add/_actions';
import { useSession } from 'next-auth/react';
import { Box, CircularProgress } from '@mui/joy';
import { IS_DEVELOPER, PAGES } from '@/common';
import AlertDialogModal from './Alert';

function WineTable() {
    const [wines, setWines] = useState<GetWineReturn[]>()
    const { data: session } = useSession();
    if (!(session?.user as any)?.id) return <CircularProgress></CircularProgress>;
    const [confirmDelete, setConfirmDelete] = useState<any>();

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
                    const pp = selected.map(async c => await _delete(c))
                    const success = (await Promise.all(pp)).every(r => r)
                    if (success) location.reload();
                }}
                data={wines.map(w => ({
                    "name": w.name || "",
                    "year": w.year,
                    "type": w.type || "",
                    "rating": w.rating || "",
                    "consumed": w.consumed ? "Yes" : "No",
                    "date_consumed": w.date_consumed
                        ? new Date(w.date_consumed).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit', weekday: 'short', })
                        : "N/A",
                    "id": w._id
                }))}
                onDelete={(row) => {
                    setConfirmDelete(String(row.id))
                }}
                editPage={PAGES.edit}
                columns={columns}
                title="Favourite Wines list"
            />}
            {confirmDelete && (
                <AlertDialogModal
                    message="Please comfirm deletion. Are you sure?"
                    onClose={() => setConfirmDelete(false)}
                    onYes={async () => {
                        if (await _delete(confirmDelete)) location.reload();
                    }}
                    type="confirm"
                ></AlertDialogModal>
            )}
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