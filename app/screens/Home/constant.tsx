import { colors } from "../../theme"

export const SUMMARY_CARDS: {
  key: string,
  title: string,
  icon: string,
  backgroundColor: string,
}[]=[
  {
    key: 'sales',
    title: 'Sales (RM)',
    icon: 'cart',
    backgroundColor: colors.palette.purple
  },
  {
    key: 'paymentCollected',
    title: 'Payment Collected (RM)',
    icon: 'dollar',
    backgroundColor: colors.palette.mintGreen
  },
  {
    key: 'stocks',
    title: 'Product Sold',
    icon: 'box',
    backgroundColor: colors.palette.orange
  },
  {
    key: 'creditNote',
    title: 'Credit Note (RM)',
    icon: 'credit',
    backgroundColor: colors.palette.orange
  },
]
