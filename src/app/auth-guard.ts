import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  // authState là một Observable trả về trạng thái user (null hoặc User object)
  return authState(auth).pipe(
    // quan trọng: take(1) để Observable tự complete sau khi nhận giá trị đầu tiên
    // Nếu không có take(1), Guard sẽ treo mãi không cho vào trang
    take(1),
    map(user => {
      const isLoggedIn = !!user; // Chuyển đổi sang boolean

      if (isLoggedIn) {
        return true; // Cho phép đi tiếp
      } else {
        // Nếu chưa đăng nhập:
        // 1. Chuyển hướng về trang login
        // 2. (Tùy chọn) Lưu lại URL hiện tại để login xong quay lại đúng chỗ đó
        return router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url }
        });
      }
    })
  );
};
