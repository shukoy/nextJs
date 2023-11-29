import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  jaJP
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';
import { Link } from '@mui/material';
import { selectDatabase } from '@/usecases/useGetList';

type GridRowType =
{
  id: string,
  title: string,
  detailText: string,
  counterMeasureText: string,
  occurrenceDate: Date,
  fixedDate: Date,
  role: string,
}

const roles = ['宇野', '今西', '廣瀬'];
const randomRole = () => {
  return randomArrayItem(roles);
};

//初期値生成
const initialRows: GridRowsProp = [
  {
    id: 1,
    title: "課題タイトル１",
    detailText: "課題詳細１",
    counterMeasureText: "課題解決策１",
    occurrenceDate: randomCreatedDate(),
    fixedDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: 2,
    title: "課題タイトル２",
    detailText: "課題詳細２",
    counterMeasureText: "課題解決策２",
    occurrenceDate: randomCreatedDate(),
    fixedDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: 3,
    title: "課題タイトル３",
    detailText: "課題詳細３",
    counterMeasureText: "課題解決策３",
    occurrenceDate: randomCreatedDate(),
    fixedDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: 4,
    title: "課題タイトル４",
    detailText: "課題詳細４",
    counterMeasureText: "課題解決策４",
    occurrenceDate: randomCreatedDate(),
    fixedDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: 5,
    title: "課題タイトル５",
    detailText: "課題詳細５",
    counterMeasureText: "課題解決策５",
    occurrenceDate: randomCreatedDate(),
    fixedDate: randomCreatedDate(),
    role: randomRole(),
  },
];


interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

//ツールバー：Add　Recordの定義
function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  //Add　Recordが押下された時の動作
  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, title: '', detailText: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'title' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export const List = () => {

    const [rows, setRows] = React.useState(initialRows);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  
    const [data, setData] = React.useState([])

    //編集終了時の処理
    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true;
      }
    };
    //編集アイコン押下時の処理
    const handleEditClick = (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };
  
    //保存アイコン押下時の処理
    const handleSaveClick = (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
      const updateRow = rows.find((row) => row.id === id);
      // updateDatabase(updateRow)
    };
  
    //削除アイコン押下時の処理
    const handleDeleteClick = (id: GridRowId) => () => {
      setRows(rows.filter((row) => row.id !== id));
    }
  
    //キャンセルアイコン押下時の処理
    const handleCancelClick = (id: GridRowId) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
  
      const editedRow = rows.find((row) => row.id === id);
      if (editedRow!.isNew) {
        setRows(rows.filter((row) => row.id !== id));
      }
    };
  
    //編集を終了したあとに呼ばれる処理、更新後の行を返却
    const processRowUpdate = (newRow: GridRowModel) => {
      const updatedRow = { ...newRow, isNew: false };
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      // updateDatabase(updatedRow)
      console.log('processRowUpdate:',rows)
      return updatedRow;
    };
  
    //行モードが変わった時
    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
      setRowModesModel(newRowModesModel);
    };

    // データベース更新用のAPI呼び出しを定義
    const updateDatabase = (updatedRow: any) => {
      //const dummy = { id: 7., title: "test", occurrenceDate: "2022-11-01", fixedDate: "2023-11-01", counterMeasureText: "課題への対策７"};
      return fetch('http://localhost:8080/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRow),
      }).then(response => response.json());
    };

    React.useEffect(() => {
      const fetchData = async () => {
        try {
          const responseData = await selectDatabase(); // 非同期処理の完了を待つ
          setData(responseData);
        } catch (error) {
          console.error('データの取得に失敗しました', error);
        }
      };
      fetchData();
    }, []);
  
     //列定義
    const columns: GridColDef[] = [
      { field: 'title', headerName: 'タイトル', width: 150, editable: true },
      { field: 'detailText', headerName: '詳細', width: 180, editable: true },
      { field: 'counterMeasureText', headerName: '解決策', width: 250, editable: true },
      {
        field: 'occurrenceDate',
        headerName: '発生日',
        type: 'date',
        width: 180,
        editable: true,
        valueGetter: (params) => {
          // データをDateオブジェクトに変換
          return new Date(params.value);
        },
      },
      {
        field: 'fixedDate',
        headerName: '解決予定日',
        type: 'date',
        width: 180,
        editable: true,
        valueGetter: (params) => {
          // データをDateオブジェクトに変換
          return new Date(params.value);
        },
      },
      {
        field: 'role',
        headerName: '担当',
        width: 100,
        editable: true,
        type: 'singleSelect',
        valueOptions: ['宇野', '今西', '廣瀬'],
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: '操作',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
  
          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(id)}
                key={id}
              />,
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
                key={id}
              />,
            ];
          }
  
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
              key={id}
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
              key={id}
            />,
          ];
        },
      },
    ];
  
    return (
      <Box
        sx={{
          height: 500,
          width: '100%',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
        />
      </Box>
    );
}