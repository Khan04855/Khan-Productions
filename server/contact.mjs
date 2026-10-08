const failure=(message,status=400)=>Object.assign(new Error(message),{status});
export const contactConfigured=()=>!!(process.env.RESEND_API_KEY?.trim()&&process.env.CONTACT_FROM?.trim());
export function validateContact(body){
 const limits={name:100,email:200,subject:200,message:3000};const value={};
 for(const [key,max] of Object.entries(limits)){
  if(typeof body[key]!=='string'||!body[key].trim()||body[key].length>max)throw failure('Please complete all fields within the displayed limits.');
  value[key]=body[key].trim();
 }
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)||/[\r\n]/.test(value.email)||/[\r\n]/.test(value.subject))throw failure('Please enter a valid email address and a single-line subject.');
 if(body.website)throw failure('This submission could not be accepted.');
 return value;
}
export async function deliverContact(body,send=fetch){
 const value=validateContact(body);
 if(!contactConfigured())throw failure('Direct sending is unavailable. Please use the support email link instead.',503);
 const response=await send('https://api.resend.com/emails',{
  method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY.trim()}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(15000),
  body:JSON.stringify({from:process.env.CONTACT_FROM.trim(),to:[process.env.CONTACT_TO?.trim()||'khanproductions7867@gmail.com'],reply_to:value.email,subject:`Website enquiry: ${value.subject}`,text:`Name: ${value.name}\nReply email: ${value.email}\n\n${value.message}`})
 });
 if(!response.ok)throw failure('Your message could not be submitted. Please try later or use the support email link.',502);
 const result=await response.json();if(typeof result.id!=='string'||!result.id)throw failure('The email service did not confirm acceptance. Please use the support email link.',502);
 return {ok:true};
}
