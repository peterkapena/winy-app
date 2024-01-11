import Image from 'next/image'
import styles from './page.module.css'
import { Box, Button, Sheet, Typography } from '@mui/joy'

export default function Home() {
  return (
    <Sheet>
      <Typography fontSize="sm">Hello World</Typography>
      <Box>
        <Button
        // onClick={() => {
        //   console.log('handle click');
        // }}
        >
          Submit
        </Button>
      </Box>
    </Sheet>
  )
}
