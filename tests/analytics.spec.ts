import {test,expect} from '@playwright/test';
test('analytics requires consent, tracks routes once, omits query and excludes admin',async({page})=>{
 await page.route('https://www.googletagmanager.com/**',route=>route.fulfill({body:'/* local test: no external analytics requests */',contentType:'application/javascript'}));
 await page.goto('/');await expect(page.getByRole('complementary',{name:'Analytics preferences'})).toBeVisible();await expect(page.locator('#khan-google-tag')).toHaveCount(0);
 await page.getByRole('button',{name:'Decline analytics',exact:true}).click();await page.reload();await expect(page.locator('#khan-google-tag')).toHaveCount(0);await expect(page.getByRole('complementary',{name:'Analytics preferences'})).toHaveCount(0);
 await page.getByRole('button',{name:'Analytics preferences',exact:true}).click();await page.getByRole('button',{name:'Accept analytics',exact:true}).click();await expect(page.locator('#khan-google-tag')).toHaveCount(1);
 const views=()=>page.evaluate(()=>((window as any).dataLayer||[]).map((v:any)=>Array.from(v)).filter((v:any)=>v[0]==='event'&&v[1]==='page_view'));
 await expect.poll(async()=> (await views()).length).toBe(1);
 await page.getByLabel('Search shop products').fill('private search value');await page.getByRole('button',{name:'Submit product search'}).click();await expect(page.getByText('No products match your search.')).toBeVisible();expect((await views()).length).toBe(1);expect(JSON.stringify(await views())).not.toContain('private');
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Tools',exact:true}).click();await expect.poll(async()=> (await views()).length).toBe(2);expect((await views())[1][2].page_location).toMatch(/\/tools$/);
 await page.getByRole('link',{name:'Admin portal',exact:true}).click();await expect(page.locator('h1')).toBeVisible();expect((await views()).length).toBe(2);expect(await page.evaluate(()=>(window as any)['ga-disable-G-0WQKC20Q7N'])).toBe(true);
});
test('analytics opt-out stops tracking and clears accessible cookies',async({page})=>{
 await page.route('https://www.googletagmanager.com/**',r=>r.fulfill({body:'/* mocked tag */',contentType:'application/javascript'}));
 await page.goto('/');await page.getByRole('button',{name:'Accept analytics'}).click();await expect(page.locator('#khan-google-tag')).toHaveCount(1);
 await page.evaluate(()=>document.cookie='_ga=test-only; Path=/');
 await page.getByRole('button',{name:'Analytics preferences',exact:true}).click();await page.getByRole('button',{name:'Decline analytics'}).click();expect(await page.evaluate(()=>document.cookie)).not.toContain('_ga=');expect(await page.evaluate(()=>(window as any)['ga-disable-G-0WQKC20Q7N'])).toBe(true);
 await page.setViewportSize({width:320,height:800});await page.getByRole('button',{name:'Analytics preferences',exact:true}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'previews/analytics-choice-mobile.png'});
});
