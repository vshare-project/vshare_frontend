import { Link } from 'react-router-dom'
import { Zap, MapPin, Clock, Shield, ChevronRight, Battery } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

const features = [
  { icon: MapPin,  title: 'Trạm xe khắp nội đô',   desc: 'Hơn 50 trạm xe phủ sóng toàn Hà Nội, dễ dàng tìm và trả xe.' },
  { icon: Battery, title: 'Pin sẵn sàng 100%',       desc: 'Xe luôn được sạc đầy trước khi bạn thuê, không lo hết pin giữa đường.' },
  { icon: Clock,   title: 'Thuê theo giờ linh hoạt', desc: 'Trả tiền đúng thời gian sử dụng, không phí cố định hàng tháng.' },
  { icon: Shield,  title: 'An toàn & bảo hiểm',      desc: 'Mỗi chuyến đi đều được bảo hiểm tai nạn, yên tâm di chuyển.' },
]

const stats = [
  { value: '50+',  label: 'Trạm xe' },
  { value: '500+', label: 'Phương tiện' },
  { value: '10K+', label: 'Chuyến/ngày' },
  { value: '4.9★', label: 'Đánh giá' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-green-50/40 to-white">
        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-green-100/60 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-64 h-64 rounded-full bg-green-50 blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 lg:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-xs text-brand-700 font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              Xe điện thuần túy · Không khí thải · Nội đô Hà Nội
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.05] text-gray-900 mb-6">
              Di chuyển{' '}
              <span className="text-gradient">thông minh</span>
              <br />trong nội đô
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
              Thuê xe điện theo giờ, pick up và trả tại bất kỳ trạm nào.
              Tiết kiệm, xanh sạch, không kẹt xe.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/map">
                <Button size="lg" className="gap-2">
                  <MapPin className="w-5 h-5" />
                  Tìm trạm xe gần đây
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline">Đăng ký miễn phí</Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-gray-100">
              {stats.map(s => (
                <div key={s.label}>
                  <div className="text-2xl font-display font-bold text-brand-600">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">
              Tại sao chọn <span className="text-gradient">VShare</span>?
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">Giải pháp di chuyển cuối cùng dành cho người Hà Nội</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-5 hover:border-green-200 hover:shadow-md transition-all group cursor-default">
                <CardContent className="p-0">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
                    <Icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-display font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl p-10 text-white shadow-xl shadow-green-200">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-3">Bắt đầu ngay hôm nay</h2>
            <p className="text-green-100 mb-6">Đăng ký miễn phí, chuyến đầu giảm 50%</p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-brand-700 hover:bg-green-50 shadow-none">
                Tạo tài khoản miễn phí
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
