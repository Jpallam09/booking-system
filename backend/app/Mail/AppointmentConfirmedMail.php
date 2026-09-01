<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentConfirmedMail extends Mailable
{
    use Queueable, SerializesModels;

    public Appointment $appointment;
    public array $details;
    public string $patientName;
    public ?string $dashboardUrl;

    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
        $this->patientName = $appointment->patient?->name ?? 'there';
        $this->details = AppointmentCreatedMail::buildDetails($appointment);
        $this->dashboardUrl = config('app.url') . '/appointments';
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your appointment is confirmed',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-confirmed',
        );
    }
}
