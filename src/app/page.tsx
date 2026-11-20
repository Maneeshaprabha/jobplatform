import { redirect } from 'next/navigation';

export default function RootPage() {
  // කෙනෙක් jobplatform.com වෙත ආවොත් ස්වයංක්‍රීයව English (/en) වෙත යොමු කරයි.
  // Middleware එක මගින් පරිශීලකයාගේ Browser Language එක අනුව මෙය වෙනස් වීමටද ඉඩ ඇත.
  redirect('/en');
}