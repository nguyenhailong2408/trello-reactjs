import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { mapOrder } from '~/utils/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'


//Khởi tạo giá trị 1 cái Slice trong redux
const initialState = {
  currentActiveBoard: null
}

//Gọi api bất đồng bộ và cập nhật dữ liệu vào Redux, dùng middleware creatAsyncThunk va extraReducers
export const fetchBoardDetailsAPI =createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    //axios trả về kết quả qua property của nó là data
    return response.data
  }
)
//Khởi tạo 1 cái Slice trong kho lưu trữ - Redux store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  //Reducers nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      //action.payload chuẩn đặt tên dữ liệu đầu vào của reducer, ở đây gán ra 1 biến có ý nghĩa hơn
      const board = action.payload

      //xử lý dữ liệu nếu cần thiết
      //...

      //update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    },
    updateCardInBoard: (state, action) => {
      const incomingCard = action.payload
      const column = state.currentActiveBoard.columns.find(c => c._id === incomingCard.columnId)
      if (column) {
        const card = column.cards.find(c => c._id === incomingCard._id)
        if (card) {
          // card.title = incomingCard.title
          Object.keys(incomingCard).forEach(key => {
            card[key] = incomingCard[key]
          })
        }
      }
    }
  },
  //ExtraRudecers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      //action.payload chính là cái response.data ở trên
      let board = action.payload
      board.FE_allUsers = board.owners.concat(board.members)
      //Sắp xếp lại dữ liệu trước khi đưa xuống bên dưới
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          //Sắp xếp lại dữ liệu trước khi đưa xuống bên dưới
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      //update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    })
  }
})

// Action creators are generated for each case reducer function
export const { updateCurrentActiveBoard, updateCardInBoard } = activeBoardSlice.actions
//Selectors: nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer