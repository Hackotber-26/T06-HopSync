// Shared white pill field used on Login/Signup — icon, input, optional
// right-side action (eye toggle, Send OTP).
export default function AuthField({ icon, right, ...inputProps }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-4">
      {icon}
      <input {...inputProps} className="flex-1 bg-transparent outline-none text-[16px] placeholder:text-gray-400" />
      {right}
    </div>
  );
}
