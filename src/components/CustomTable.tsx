import * as React from 'react';
import Box from '@mui/joy/Box';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Tooltip from '@mui/joy/Tooltip';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { visuallyHidden } from '@mui/utils';
import { Button } from '@mui/joy';
import AlertDialogModal from './Alert';
import { useRouter } from 'next/navigation';

type CommonType = number | string | Date | boolean;

// Types for props
interface Data {
    [key: string]: CommonType;
}

interface Column {
    id: string;
    label: string;
    numeric: boolean;
}

interface TableProps {
    data: Data[];
    columns: Column[];
    title: string;
    editPage: string;
    onDelete: (data: Data) => void
    handleDeleteAll: (selected: readonly string[]) => void;
    canDelete: boolean
}

function labelDisplayedRows({
    from,
    to,
    count,
}: {
    from: number;
    to: number;
    count: number;
}) {
    return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: CommonType },
    b: { [key in Key]: CommonType },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
    columns: Column[];

}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <thead>
            <tr>
                <th>
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        slotProps={{
                            input: {
                                'aria-label': 'select all desserts',
                            },
                        }}
                        sx={{ verticalAlign: 'sub' }}
                    />
                </th>
                {props.columns.map((headCell) => {
                    const active = orderBy === headCell.id;
                    return (
                        <th
                            key={headCell.id}
                            aria-sort={
                                active
                                    ? ({ asc: 'ascending', desc: 'descending' } as const)[order]
                                    : undefined
                            }
                        >
                            <Link
                                underline="none"
                                color="neutral"
                                textColor={active ? 'primary.plainColor' : undefined}
                                component="button"
                                onClick={createSortHandler(headCell.id)}
                                fontWeight="lg"
                                startDecorator={
                                    headCell.numeric ? (
                                        <ArrowDownwardIcon sx={{ opacity: active ? 1 : 0 }} />
                                    ) : null
                                }
                                endDecorator={
                                    !headCell.numeric ? (
                                        <ArrowDownwardIcon sx={{ opacity: active ? 1 : 0 }} />
                                    ) : null
                                }
                                sx={{
                                    '& svg': {
                                        transition: '0.2s',
                                        transform:
                                            active && order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                                    },
                                    '&:hover': { '& svg': { opacity: 1 } },
                                }}
                            >
                                {headCell.label}
                                {active ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </Link>
                        </th>
                    );
                })}
                <th>
                    Actions
                    {/* Add your action buttons or other content here */}
                </th>
            </tr>
        </thead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;
    title: string;
    setConfirmDelete: () => void
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, setConfirmDelete } = props;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                py: 1,
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: 'background.level1',
                }),
                borderTopLeftRadius: 'var(--unstable_actionRadius)',
                borderTopRightRadius: 'var(--unstable_actionRadius)',
            }}
        >
            {numSelected > 0 ? (
                <Typography sx={{ flex: '1 1 100%' }} component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    level="body-lg"
                    sx={{ flex: '1 1 100%' }}
                    id="tableTitle"
                    component="div"
                >
                    {props.title}
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton size="sm" color="danger" variant="solid" onClick={setConfirmDelete}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <div>
                </div>
            )}
        </Box>
    );
}

export default function TableSortAndSelection({ columns, data, title, editPage, onDelete, handleDeleteAll, canDelete }: TableProps) {
    const { push } = useRouter();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('calories');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [confirmDelete, setConfirmDelete] = React.useState<string>();

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = data.map((n) => String(n.id));
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any, newValue: number | null) => {
        setRowsPerPage(parseInt(newValue!.toString(), 10));
        setPage(0);
    };

    const getLabelDisplayedRowsTo = () => {
        if (data.length === -1) {
            return (page + 1) * rowsPerPage;
        }
        return rowsPerPage === -1
            ? data.length
            : Math.min(data.length, (page + 1) * rowsPerPage);
    };

    const handleYes = async () => {
        handleDeleteAll(selected)
        setConfirmDelete("")
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    return (
        <Box
            // variant="outlined"
            sx={{ width: '100%', boxShadow: 'sm', borderRadius: 'sm' }}
        >
            <EnhancedTableToolbar setConfirmDelete={() => setConfirmDelete("selected")} title={title} numSelected={selected.length} />

            {confirmDelete && (
                <AlertDialogModal
                    message={`Please confirm deletion of ${selected.length} items. Are you sure?`}
                    onClose={() => setConfirmDelete("")}
                    onYes={() => handleYes()}
                    type="confirm"
                />
            )}

            <Table
                stripe={'even'}
                aria-labelledby="tableTitle"
                hoverRow
                variant='outlined'
                sx={{
                    '--TableCell-headBackground': 'transparent',
                    '--TableCell-selectedBackground': (theme) =>
                        theme.vars.palette.success.softBg,
                }}
                borderAxis="bothBetween">
                <EnhancedTableHead
                    columns={columns}
                    numSelected={selected.length}
                    order={order}
                    orderBy={String(orderBy)}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={data.length}
                />
                <tbody>
                    {
                        stableSort(data, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const isItemSelected = isSelected(String(row.id));
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <tr
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id as string}
                                        style={
                                            isItemSelected ? {
                                                '--TableCell-dataBackground': 'var(--TableCell-selectedBackground)',
                                                '--TableCell-headBackground': 'var(--TableCell-selectedBackground)',
                                            } as React.CSSProperties : {}
                                        }
                                    >
                                        <th scope="row">
                                            <Checkbox
                                                onClick={(event) => handleClick(event, String(row.id))}
                                                checked={isItemSelected}
                                                slotProps={{
                                                    input: {
                                                        'aria-labelledby': labelId,
                                                    },
                                                }}
                                                sx={{ verticalAlign: 'top' }}
                                            />
                                        </th>
                                        {columns.map((column) => {
                                            return (
                                                <td key={column.id} align={column.numeric ? 'right' : 'left'}>
                                                    {row[column.id].toString()}
                                                </td>
                                            );
                                        })}

                                        <td>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button size="sm" variant="plain" color="neutral"
                                                    onClick={() => push(editPage + row.id)}>
                                                    Edit
                                                </Button>
                                                {canDelete && <Button size="sm" variant="soft" color="danger"
                                                    onClick={() => onDelete(row)}
                                                >
                                                    Delete
                                                </Button>}
                                            </Box>
                                        </td>
                                    </tr>
                                );
                            })
                    }

                    {emptyRows > 0 && (
                        <tr
                            style={
                                {
                                    height: `calc(${emptyRows} * 40px)`,
                                    '--TableRow-hoverBackground': 'transparent',
                                } as React.CSSProperties
                            }
                        >
                            <td colSpan={6} aria-hidden />
                        </tr>
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={8}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <FormControl orientation="horizontal" size="sm">
                                    <FormLabel>Rows per page:</FormLabel>
                                    <Select onChange={handleChangeRowsPerPage} value={rowsPerPage}>
                                        <Option value={5}>5</Option>
                                        <Option value={10}>10</Option>
                                        <Option value={25}>25</Option>
                                    </Select>
                                </FormControl>
                                <Typography textAlign="center" sx={{ minWidth: 80 }}>
                                    {labelDisplayedRows({
                                        from: data.length === 0 ? 0 : page * rowsPerPage + 1,
                                        to: getLabelDisplayedRowsTo(),
                                        count: data.length === -1 ? -1 : data.length,
                                    })}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton
                                        size="sm"
                                        color="neutral"
                                        variant="outlined"
                                        disabled={page === 0}
                                        onClick={() => handleChangePage(page - 1)}
                                        sx={{ bgcolor: 'background.surface' }}
                                    >
                                        <KeyboardArrowLeftIcon />
                                    </IconButton>
                                    <IconButton
                                        size="sm"
                                        color="neutral"
                                        variant="outlined"
                                        disabled={
                                            data.length !== -1
                                                ? page >= Math.ceil(data.length / rowsPerPage) - 1
                                                : false
                                        }
                                        onClick={() => handleChangePage(page + 1)}
                                        sx={{ bgcolor: 'background.surface' }}
                                    >
                                        <KeyboardArrowRightIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </Box>
    );
}
