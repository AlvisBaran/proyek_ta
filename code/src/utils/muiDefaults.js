export const MUIDataGridDefaults = {
  columns: [],
  autoHeight: true,
  pagination: true,
  rowHeight: 62,
  density: 'compact',
  pageSizeOptions: [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' }
    // { value: -1, label: "All" },
  ],
  keepNonExistentRowsSelected: true,
  disableRowSelectionOnClick: true,
  initialState: {
    pagination: {
      paginationModel: {
        pageSize: 10
      }
    }
  }
}
