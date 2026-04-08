import healingStoryClient from './client'

export const createPhotobook = async ({ startDate, endDate, limit } = {}) => {
  const res = await healingStoryClient.post('/photobook/create', {
    ...(limit ? { limit } : { start_date: startDate, end_date: endDate }),
  })
  return res.data
}

export const orderPhotobook = async ({
  bookId,
  recipientName,
  recipientPhone,
  postalCode,
  address1,
  address2 = '',
  memo = '',
}) => {
  const res = await healingStoryClient.post('/photobook/order', {
    book_uid: bookId,
    recipient_name: recipientName,
    recipient_phone: recipientPhone,
    postal_code: postalCode,
    address1,
    address2,
    memo,
  })
  return res.data
}

export const getOrderStatus = async (orderId) => {
  const res = await healingStoryClient.get(`/photobook/order/${orderId}`)
  return res.data
}
