import { Link, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { useFetcher } from '~/hooks'
import style from '~/styles/ReportCreate.module.css'
import { DReport } from '~/types/data'

const ReportDetail = () => {
  const idReport = useParams().reportParam?.slice(-29, -5)
  const apiReport = `api/v1/reports/${idReport}`

  const fetcher = useFetcher()
  const { data: report } = useSWR(apiReport, fetcher) as {
    data: DReport
  }
  console.log(report)
  return (
    <div className={style.create__report}>
      <div className={style.form}>
        <Link to={report?.path ? report?.path : '*'}>
          <div className={style.title}>
            <div className={style.photo}>
              <img
                src={
                  report?.photo
                    ? report?.photo
                    : '/src/assets/disc.png'
                }
              />
            </div>
            <div className='more__links'>
              <h1>Báo cáo</h1>
              <h2>{report?.title}</h2>
            </div>
          </div>
        </Link>
        <div className={style.category}>
          <label>Loại</label>
          <div className={style.wrapper}>
            {report?.category}
          </div>
        </div>
        <div className={style.description}>
          <label>Mô tả</label>
          <div className={style.wrapper}>
            {report?.description}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportDetail
