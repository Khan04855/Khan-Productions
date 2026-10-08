import { test, expect } from '@playwright/test';
test('store grid, header search, categories and manual highlights', async ({page}) => {
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for (const theme of ['light','dark']) {
  await page.goto('/');await page.evaluate(t=>localStorage.setItem('khan-theme',t),theme);
  for (const width of [320,390,768,1024,1440]) {
   await page.setViewportSize({width,height:900});await page.goto('/');
   await expect(page.locator('.product-grid article')).toHaveCount(12);
   const columns=await page.locator('.product-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);
   expect(columns).toBe(width>=1024?4:2);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
   await expect(page.getByRole('button',{name:'Compact view'})).toHaveCount(0);
  }
 }
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 await page.getByLabel('Search shop products').fill('no-match-layout');await page.getByRole('button',{name:'Submit product search',exact:true}).click();
 await expect(page.getByText('No products match your search.')).toBeVisible();
 await page.getByRole('button',{name:'Show all products',exact:true}).click();
 const chip=page.locator('.category-chip').nth(1);const category=await chip.innerText();await chip.click();
 await expect(page.locator('#product-category')).toHaveValue(category);
 await page.locator('.category-chip').first().click();
 await page.getByRole('button',{name:'Next highlight'}).click();await expect(page.getByRole('button',{name:'Show highlight 2'})).toHaveAttribute('aria-current','true');
 await page.waitForFunction(()=>{const active=document.querySelector('.showcase-slide[aria-hidden=false]');const viewport=document.querySelector('.showcase-viewport');return !!active&&!!viewport&&Math.abs(active.getBoundingClientRect().left-viewport.getBoundingClientRect().left)<2;});await page.locator('.product-showcase').scrollIntoViewIfNeeded();await page.screenshot({path:'previews/store-showcase-mobile.png'});
 await page.locator('.product-grid').scrollIntoViewIfNeeded();
 await page.screenshot({path:'previews/store-layout-mobile.png'});
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');await page.locator('.product-grid').scrollIntoViewIfNeeded();await page.screenshot({path:'previews/store-layout-desktop.png'});
 expect(errors).toEqual([]);
});
