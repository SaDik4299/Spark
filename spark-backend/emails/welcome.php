<?php
// ── EMAILS/WELCOME.PHP ──
// Uses PHP's built-in mail() with Gmail SMTP via php.ini
// Or swap to PHPMailer for more reliable delivery

require_once __DIR__ . '/../config/db.php';

function sendWelcomeEmail($toEmail, $userName) {
    $subject = "Welcome to Spark — Let's find your career!";
    $from    = GMAIL_USER;

    $html = '<!DOCTYPE html>
<html>
<head>
  <style>
    body{font-family:Arial,sans-serif;background:#0C0C0F;color:#F0EEE8;margin:0;padding:0}
    .wrap{max-width:560px;margin:40px auto;background:#141418;border-radius:16px;border:1px solid rgba(255,255,255,0.07);overflow:hidden}
    .header{padding:32px 40px 20px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.07)}
    .logo{font-size:1.8rem;font-weight:800;color:#FF6B2B}
    .body{padding:36px 40px}
    h1{font-size:1.35rem;font-weight:700;color:#F0EEE8;margin:0 0 12px}
    p{font-size:0.92rem;line-height:1.7;color:rgba(240,238,232,0.65);margin:0 0 16px}
    .btn{display:inline-block;background:linear-gradient(135deg,#FF6B2B,#FF9500);color:#fff;text-decoration:none;padding:13px 28px;border-radius:10px;font-weight:600;font-size:0.92rem;margin:8px 0 24px}
    .highlight{color:#FF9500;font-weight:600}
    .footer{padding:18px 40px;border-top:1px solid rgba(255,255,255,0.07);font-size:0.75rem;color:rgba(240,238,232,0.3);text-align:center}
    .steps{background:#1C1C22;border-radius:12px;padding:20px 24px;margin:20px 0}
    .step{display:flex;gap:12px;align-items:flex-start;margin-bottom:14px}
    .step:last-child{margin-bottom:0}
    .step-num{background:#FF6B2B;color:#fff;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;flex-shrink:0;margin-top:2px}
    .step-text{font-size:0.85rem;color:rgba(240,238,232,0.7);line-height:1.5}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <div class="logo">⚡ Spark</div>
    </div>
    <div class="body">
      <h1>Welcome, ' . htmlspecialchars($userName) . '! 🎉</h1>
      <p>You\'ve just taken the first step toward finding the career you were <span class="highlight">built for</span>. Spark uses AI to match your personality, interests and strengths to real career paths — with salary data and a step-by-step roadmap.</p>

      <div class="steps">
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-text"><strong style="color:#F0EEE8">Complete your profile</strong> — Tell us your background, education and interests.</div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-text"><strong style="color:#F0EEE8">Take the quiz</strong> — 10 smart questions about your personality and working style.</div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-text"><strong style="color:#F0EEE8">Get your matches</strong> — AI-powered career suggestions with salary ranges and roadmaps.</div>
        </div>
      </div>

      <a href="' . SITE_URL . '/profile.html" class="btn">Start your journey →</a>

      <p style="font-size:0.82rem;color:rgba(240,238,232,0.35)">If you didn\'t create this account, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      ⚡ Spark — Ignite your career &nbsp;|&nbsp; <a href="mailto:' . ADMIN_EMAIL . '" style="color:#FF6B2B">' . ADMIN_EMAIL . '</a>
    </div>
  </div>
</body>
</html>';

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Spark <$from>\r\n";
    $headers .= "Reply-To: $from\r\n";

    return @mail($toEmail, $subject, $html, $headers);
}
