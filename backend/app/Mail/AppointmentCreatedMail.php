<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public Appointment $appointment;
    public array $details;
    public string $patientName;

    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
        $this->patientName = $appointment->patient?->name ?? 'there';
        $this->details = self::buildDetails($appointment);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your appointment request is pending',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-created',
        );
    }

    public static function buildDetails(Appointment $appointment): array
    {
        return [
            'service' => $appointment->service?->title ?? '—',
            'dentist' => $appointment->dentist?->name ?? 'To be assigned',
            'date' => $appointment->appointment_date?->format('D, M j, Y · g:i A') ?? '—',
            'status' => ucfirst($appointment->status?->value ?? 'pending'),
        ];
    }
}
