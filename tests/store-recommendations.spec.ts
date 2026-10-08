import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('simplified store, trust pages, themed slides and canonical URLs',async({page})=>{
 await page.goto('/');await expect(page.getByRole('searchbox')).toHaveCount(1);await expect(page.getByRole('combobox',{name:'Category',exact:true})).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'Everyday essentials',exact:true})).toBeVisible();
 await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://ikhanproductions.com/');
 await page.locator('#featured-products').scrollIntoViewIfNeeded();await page.screenshot({path:'previews/recommendations-store.png'});
 for(const route of ['/privacy','/affiliate-disclosure']){
  await page.goto(route);await expect(page.locator('h1')).toBeVisible();await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://ikhanproductions.com'+route);
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))).toEqual([]);
 }
});
test('contact submission shows provider acceptance and preserves fields on failure',async({page})=>{
 await page.route('**/api/contact/config',r=>r.fulfill({json:{enabled:true}}));
 await page.route('**/api/contact',r=>r.fulfill({json:{ok:true}}));
 await page.goto('/');await expect(page.getByRole('button',{name:'Send message',exact:true})).toBeVisible();
 for(const [label,value] of [['Name','Test visitor'],['Email','visitor@example.com'],['Subject','Website question'],['Message','A test message.']])await page.getByLabel(label,{exact:true}).fill(value);
 await page.getByRole('button',{name:'Send message',exact:true}).click();await expect(page.getByText('Your message was accepted for email delivery. Thank you for contacting us.')).toBeVisible();await expect(page.getByLabel('Message',{exact:true})).toHaveValue('');
 await page.route('**/api/contact',r=>r.fulfill({status:502,json:{error:'Delivery unavailable. Use support email.'}}));
 for(const [label,value] of [['Name','Test visitor'],['Email','visitor@example.com'],['Subject','Website question'],['Message','Keep this message.']])await page.getByLabel(label,{exact:true}).fill(value);
 await page.getByRole('button',{name:'Send message',exact:true}).click();await expect(page.getByText('Delivery unavailable. Use support email.')).toBeVisible();await expect(page.getByLabel('Message',{exact:true})).toHaveValue('Keep this message.');
});

// Keep non-analytics checks independent of the optional analytics banner.
test.beforeEach(async({page})=>{await page.addInitScript(()=>localStorage.setItem('khan-analytics-choice','declined'));});
