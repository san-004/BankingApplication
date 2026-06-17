import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <!-- Navigation -->
      <nav class="navbar">
        <div class="nav-content">
          <div class="nav-brand">
            <i class="fas fa-university"></i>
            <span>SecureBank</span>
          </div>
          <ul class="nav-links">
            <li>
              <a routerLink="/dashboard" routerLinkActive="active">
                <i class="fas fa-tachometer-alt"></i> Dashboard
              </a>
            </li>
            <li>
              <a routerLink="/accounts" routerLinkActive="active">
                <i class="fas fa-wallet"></i> Accounts
              </a>
            </li>
            <li>
              <a routerLink="/transactions" routerLinkActive="active">
                <i class="fas fa-exchange-alt"></i> Transactions
              </a>
            </li>
            <li>
              <a routerLink="/multithreading" routerLinkActive="active">
                <i class="fas fa-layer-group"></i> Multithreading
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <div class="container">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <p>&copy; 2024 SecureBank - Banking Application Demo | Full Stack Development</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .navbar {
      background: linear-gradient(135deg, #1a237e 0%, #1565c0 100%);
      padding: 0 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      color: white;
      font-size: 20px;
      font-weight: 700;
    }

    .nav-brand i {
      font-size: 24px;
    }

    .nav-links {
      display: flex;
      list-style: none;
      gap: 4px;
    }

    .nav-links a {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      color: rgba(255, 255, 255, 0.8);
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s;
    }

    .nav-links a:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-links a.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .main-content {
      flex: 1;
      padding: 32px 20px;
    }

    .footer {
      background: #1a1a1a;
      color: rgba(255, 255, 255, 0.7);
      text-align: center;
      padding: 16px;
      font-size: 13px;
    }
  `]
})
export class AppComponent {
  title = 'SecureBank - Banking Application';
}
